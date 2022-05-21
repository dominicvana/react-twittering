import { useState, useEffect } from 'react';
import User from './User';
import Tweet from './Tweet';

const CATEGORIES = ['retweets', 'mentions', 'hashtags', 'contains'];

const SearchParams = () => {
  const [username, setUsername] = useState('balajis');
  const [category, setCategory] = useState('');
  const [maxResults, setMaxResults] = useState(10);
  const [{ tweets, user }, setData] = useState({ tweets: [], user: {} });

  useEffect(() => {
    getData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function getData() {
    const alreadyInLocalStorage = window.localStorage.getItem(username);

    if (alreadyInLocalStorage) {
      console.log('Getting data from local storage...');

      setData(JSON.parse(alreadyInLocalStorage));
    } else {
      console.log('Fetching data from the API...');

      const apiResponse = await fetch(
        `http://localhost:3001/api/tweets/${username}`
      ).then(r => r.json());

      setData(apiResponse);

      window.localStorage.setItem(username, JSON.stringify(apiResponse));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    getData();
  }

  return (
    <div className="search-params">
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">
          Twitter username {username}
          <br />
          <input
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />
        </label>
        <br />
        <br />
        <label htmlFor="category">
          Search by {category}
          <br />
          <select
            id="category"
            type="text"
            value={category}
            onChange={e => {
              setCategory(e.target.value);
            }}
            onBlur={e => {
              setCategory(e.target.value);
            }}
          >
            <option />
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <br />
        <br />
        <label htmlFor="max-results">
          Max results {maxResults}
          <br />
          <input
            id="max-results"
            type="number"
            value={maxResults}
            onChange={e => {
              setMaxResults(e.target.value);
            }}
            onBlur={e => {
              setMaxResults(e.target.value);
            }}
          />
        </label>
        <br />
        <br />
        <button type="submit" style={{ padding: '0.5rem 1rem' }}>
          Get tweets
        </button>
      </form>

      <User
        key={user.id}
        name={user.name}
        username={user.username}
        location={user.location}
      />
      <section>
        <ul>
          {tweets.map(t => {
            const {
              id,
              text,
              created_at: createdAt,
              public_metrics: publicMetrics,
            } = t;

            return <Tweet key={id} {...{ text, createdAt, publicMetrics }} />;
          })}
        </ul>
      </section>
    </div>
  );
};

export default SearchParams;
