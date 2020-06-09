import React from 'react';

import {SubredditPostResponseJson, LinkPostJson, LinkPost} from '../util/RedditApiTypes';

const SubredditPostList = (
	{posts}
	: {posts: LinkPost[]}
) => {

	return (
		<div>
			{/* TODO: Add css to hide the numbers, list-style I think?*/}
			<ol>
				{posts.map(post => (
					<li key={post.id}>
						{post.title}
					</li>
				))}
			</ol>
		</div>
	)
}

export default SubredditPostList;
