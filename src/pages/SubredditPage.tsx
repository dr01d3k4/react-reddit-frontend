import React from 'react';
import {useParams} from 'react-router-dom';

import SubredditPostFetcher from '../components/SubredditPostFetcher';

const Subreddit = () =>
{
	let {subreddit} = useParams();
	return (
		<div>
			<h1>Posts for {subreddit}</h1>
			<SubredditPostFetcher subreddit={subreddit} />
		</div>
	);
}

export default Subreddit;
