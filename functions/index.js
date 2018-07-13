const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.fetchRSS = functions.https.onRequest((_, response) => {
  const NEWS_LIST_KEY = 'newsList';
  const BASE_DATE_FORMAT = 'YYYY-MM-DD';
  const START_DAYS = -50;
  const moment = require('moment-timezone');
  moment.tz.setDefault('Asia/Tokyo');
  const onError = err => {
    console.log(`err: ${err}`);
    response.send({ err });
  };
  const filterFeedItems = ({ baseDate, sortKey, fromDate, name, items }) => {
    const newsList = [];
    items.forEach(item => {
      newsList.push({
        name,
        title: item.title,
        link: item.link,
        summary: item.summary ? item.summary : item.content,
        pubDate: item.pubDate,
        baseDate: baseDate.format(BASE_DATE_FORMAT),
        sortKey,
      });
    });
    return newsList.filter(n => {
      const unix = moment(n.pubDate).unix();
      return unix >= fromDate.unix() && unix < baseDate.unix();
    });
  };
  const removeItems = (baseDate, nextFunc) => {
    admin
      .database()
      .ref(NEWS_LIST_KEY)
      .orderByChild('baseDate')
      .equalTo(baseDate.format(BASE_DATE_FORMAT))
      .once('value')
      .then(snapShot => {
        if (!snapShot || !snapShot.val()) {
          return;
        }
        Object.keys(snapShot.val()).forEach(k => {
          admin
            .database()
            .ref(NEWS_LIST_KEY)
            .child(k)
            .remove();
        });
        return;
      })
      .catch(err => {
        throw err;
      });
    nextFunc();
  };
  const storeItems = items => {
    console.log(`Storing Data to Firebase`);
    const ref = admin.database().ref(NEWS_LIST_KEY);
    items.forEach(item => {
      ref.push().set(item);
    });
    console.log(`Done`);
  };
  const parseRSS = ({ baseDate, fromDate, sortKeyGenerator, name, url }) => {
    return new Promise((resolve, reject) => {
      console.log(`Fetching RSS: ${name} ${url}`);
      const Parser = require('rss-parser');
      const parser = new Parser();
      parser
        .parseURL(url)
        .then(feed => {
          const items = filterFeedItems({
            sortKey: sortKeyGenerator(),
            baseDate,
            fromDate,
            name,
            items: feed.items,
          });
          storeItems(items);
          resolve();
          return;
        })
        .catch(err => {
          reject(err);
        });
    });
  };
  const fetchSites = (offset, nextFunc) => {
    return new Promise((resolve, reject) => {
      const baseDate = moment()
        .tz('Asia/Tokyo')
        .startOf('day')
        .startOf('isoWeek')
        .add(offset, 'days');
      const fromDate = baseDate.clone().add(-7, 'days');
      const sortKeyGenerator = (() => {
        let sortKey = 0 - baseDate.unix();
        return () => {
          return sortKey--;
        }
      })()
      // Remove items which has the same sortKey before insert
      removeItems(baseDate, () => {
        const sitesRef = admin.database().ref('sites');
        sitesRef
          .limitToLast(1000)
          .once('value')
          .then(snapShot => {
            const promises = [];
            Object.keys(snapShot.val()).forEach(k => {
              promises.push(
                parseRSS({
                  baseDate,
                  fromDate,
                  sortKeyGenerator,
                  name: snapShot.val()[k].name,
                  url: snapShot.val()[k].url,
                })
              );
            });
            nextFunc(promises, (result, err) => {
              result ? resolve() : reject(err);
            });
            return;
          })
          .catch(onError);
      });
    });
  };
  const waitAll = (promises, nextFunc) => {
    Promise.all(promises)
      .then(() => {
        nextFunc(true, null);
        return;
      })
      .catch(err => {
        nextFunc(false, err);
      });
  };
  const processDayByDay = (() => {
    let i = START_DAYS;
    return onEndFunc => {
      i += 7;
      console.log('fetching RSS...');
      fetchSites(i, waitAll)
        .then(() => {
          if (i > 0) {
            onEndFunc();
          } else {
            console.log('Done!');
            processDayByDay(onEndFunc);
          }
          return;
        })
        .catch(err => {
          throw err;
        });
    };
  })();
  processDayByDay(() => {
    response.send('Fetch RSS Completed');
  });
});
