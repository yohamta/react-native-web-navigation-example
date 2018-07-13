import React, { Component } from 'react';
import { ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';
import { View, Text, SectionList, Dimensions } from 'react-native-web';
import _ from 'lodash';
import { News } from '../components';

const NEWS_LIST_QUERY = gql`
  query($startAt: String) {
    newsList
      @rtdbQuery(
        ref: "newsList"
        type: "NewsList"
        orderByChild: "sortKey"
        startAt: $startAt
        limitToFirst: 10
      )
      @array {
      id @key
      baseDate
      link
      name
      pubDate
      summary
      title
      sortKey
    }
  }
`;

class NewsList extends Component {
  state = {
    newsList: [],
    shouldRefresh: true,
    startAt: Number.MIN_SAFE_INTEGER,
    fetching: false,
    reachedToEnd: false,
  };

  async query(client) {
    if (this.state.fetching || this.state.reachedToEnd) {
      return;
    }
    this.setState({ shouldRefresh: false, fetching: true });
    const { data, err } = await client.query({
      query: NEWS_LIST_QUERY,
      variables: { startAt: this.state.startAt },
    });
    if (data && data.newsList.length > 0) {
      const newsList = [...this.state.newsList, ...data.newsList];
      this.setState({
        newsList,
        startAt: _.last(newsList).sortKey + 1,
      });
    } else if (err) {
      console.log(`err: ${err}`);
    } else {
      this.setState({
        reachedToEnd: true,
      });
    }
    this.setState({
      fetching: false,
    });
  }

  keyExtractor(item) {
    return item.id;
  }

  reshapeData(newsList) {
    const t = _.groupBy(newsList, v => v.baseDate);
    return _.map(Object.keys(t), key => ({
      baseDate: key,
      data: t[key],
    }));
  }

  renderItem({ item }) {
    return <News item={item} />;
  }

  renderSectionHeader({ section }) {
    return (
      <View style={{ backgroundColor: '#8af', paddingVertical: 5 }}>
        <Text style={{ textAlign: 'center' }}>{section.baseDate}</Text>
      </View>
    );
  }

  render() {
    return (
      <ApolloConsumer>
        {client => {
          if (this.state.shouldRefresh) {
            this.query(client);
          }
          if (!this.state.newsList.length) {
            return (
              <View>
                <Text>Loading...</Text>
              </View>
            );
          }
          return (
            <SectionList
              keyExtractor={this.keyExtractor}
              renderItem={this.renderItem}
              renderSectionHeader={this.renderSectionHeader}
              sections={this.reshapeData(this.state.newsList)}
              onEndReached={() => {
                this.query(client);
              }}
              style={{
                height: Dimensions.get('window').height,
              }}
            />
          );
        }}
      </ApolloConsumer>
    );
  }
}

export default NewsList;
