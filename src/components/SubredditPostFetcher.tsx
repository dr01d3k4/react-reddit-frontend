import React from 'react';
import {ErrorBoundary} from 'react-error-boundary'

import SubredditPostList from './SubredditPostList';

import {useAsyncResource, DataReader} from '../util/useAsyncResource';
import {SubredditPostResponseJson, LinkPostJson, LinkPost} from '../util/RedditApiTypes';

const fetchSubredditPosts = (subreddit: string, after: string) => {
	const url = `https://api.reddit.com/r/${subreddit}?after=${after}`;
	console.log(`fetchSubredditPosts called for subreddit "${subreddit}" with after "${after}"; Final url: \`${url}\``);
	return fetch(url);
}

const SubredditPostFetcherInternal = (
	{subredditPostReader}
	: {subredditPostReader: DataReader<SubredditPostResponseJson>}
) => {
	// TODO: What about error case?
	const response: SubredditPostResponseJson = subredditPostReader();
	if (!response || !response.data)
	{
		// TODO: Sometimes getting a subreddit that doesn't exist gives an error
		// Sometimes we just get response.data = null
		return null;
	}

	const posts: LinkPost[] = response.data.children.map((post: LinkPostJson) => post.data);
	return (<SubredditPostList posts={posts} />);
}

const ErrorFallback = ({error, componentStack, resetErrorBoundary}: any) =>
{
	return <h3>Error fetching subreddit</h3>;
}

const SubredditPostFetcher = ({subreddit}: {subreddit: string}) =>
{
	const after = "";
	const [subredditPostReader, updateSubredditPostReader] = useAsyncResource<SubredditPostResponseJson>(fetchSubredditPosts);

	// TODO: Fix ` React Hook React.useEffect has a missing dependency: 'updateSubredditReader'. Either include it or remove the dependency array  react-hooks/exhaustive-deps` warning
	React.useEffect(() => updateSubredditPostReader(subreddit, after), [subreddit]);

	return (
		// TODO: Maybe move the error boundary up?
		<ErrorBoundary
			FallbackComponent={ErrorFallback}
			resetKeys={[subreddit]}
		>
			<React.Suspense fallback={`Loading posts for r/${subreddit}...`}>
				<SubredditPostFetcherInternal subredditPostReader={subredditPostReader} />
			</React.Suspense>
		</ErrorBoundary>
	)
}

export default SubredditPostFetcher;
