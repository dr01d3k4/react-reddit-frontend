import React from 'react';
import HomePage from './pages/HomePage';
import PageNotFound from './pages/PageNotFound';
import SubredditPage from './pages/SubredditPage';

import {BrowserRouter as Router, Route, Switch, useParams} from 'react-router-dom';


// Old version before adding router
import SelectSubreddit from './components/SelectSubreddit';
import SubredditPostFetcher from './components/SubredditPostFetcher';
const OldApp = () =>
{
	const [subreddit, setSubreddit] = React.useState("reactjs");

	return (
		<div className="App">
			<SelectSubreddit subreddit={subreddit} setSubreddit={setSubreddit}/>
			<SubredditPostFetcher subreddit={subreddit}/>
		</div>
	);
}

const PageRouting = () =>
{
	return (
		<Router>
			<Switch>
				<Route exact path="/" component={HomePage} />
				<Route path="/r/:subreddit" component={SubredditPage} />
				<Route exact path="*" component={PageNotFound} />
			</Switch>
		</Router>
	);
}


const App = () =>
{
	return (
		<div className="App">
			<PageRouting />
		</div>
	);
}

export default App;
