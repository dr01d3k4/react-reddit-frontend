// TODO: Is there a time/utc type? Maybe `type UtcTimestamp = number`
// TODO: number or bigint?
// TODO: Split these interfaces out into smaller ones then use `&` operator
// TODO: Maybe give better names, like `type Kind = "t1" | "t2" | etc.`, `type Id = string` etc.



// Of the form `tN_xyz` (where N = a number, xyz = a guid)
export type RedditId = string;

interface Author
{
	author: string;
	author_flair_background_color: any | null; // Likely `string | null`
	author_flair_css_class: any | null; // Likely `string | null`
	author_flair_richtext: any[]; // Defaults to [], likely `string[]`
	author_flair_template_id: any | null; // Likely `string | null`
	author_flair_text: any | null; // Likely `string | null`
	author_flair_text_color: any | null; // Likely `string | null`
	author_flair_type: string;
	author_fullname: RedditId;
	author_patreon_flair: boolean;
	author_premium: boolean;
};

interface Votes
{
	downs: number;
	score: number;
	ups: number;
};

interface Moderation
{
	banned_at_utc: any | null; // Likely `number | null`
	banned_by: any | null; // Likely `User | null`
	can_mod_post: boolean;
	mod_note: any | null; // Likely `string | null`
	mod_reason_by: any | null; // Likely `User | null`
	mod_reason_title: any | null; // Likely `string | null`
	mod_reports: any[]; // Defaults to []
	num_reports: any | null; // Likely `number | null`
	removal_reason: any | null; // Maybe `string | null`
	report_reasons: any | null; // Likely `string[] | null`
	user_reports: any[]; // Defaults to [], likely string[]
};

interface Awards
{
	all_awardings: any[]; // Defaults to []
	awarders: any[]; // Defaults to [], likey User[]
	total_awards_received: number;
};

// TODO: Split up further?
type PostCommentShared = Author & Votes & Moderation & Awards &
{
	approved_at_utc: any | null; // Likely `number | null`
	approved_by: any | null; // Likely `User | null`
	archived: boolean;
	can_gild: boolean;
	created: number;
	created_utc: number;
	distinguished: string | null;
	edited: boolean;
	gilded: number;
	gildings: any; // Defaults to {}
	id: RedditId;
	likes: any | null;
	locked: boolean;
	name: RedditId;
	no_follow: boolean;
	permalink: string;
	saved: boolean;
	send_replies: boolean;
	stickied: boolean;
	subreddit: string;
	subreddit_id: RedditId;
	subreddit_name_prefixed: string;
	subreddit_type: string; // TODO: Likely can be enum
	treatment_tags: any[]; // Defaults to [], likely `string[]`
};

export type Comment = PostCommentShared & {
	associated_rewards: any | null;
	body: string;
	body_html: string;
	collapsed: boolean;
	collapsed_because_crowd_control: any | null;
	collapsed_reason: any | null;
	controversiality: number;
	depth: number;
	is_submitter: boolean;
	link_id: RedditId;
	parent_id: RedditId;
	replies: CommentResponseJson[];
	score_hidden: boolean;
};

interface LinkPostFlair
{
	link_flair_background_color: string; // Of "#ffffff" form
	link_flair_css_class: string;
	link_flair_richtext: any[]; // Defaults to []
	link_flair_template_id: string;
	link_flair_text: string;
	link_flair_text_color: string;
	link_flair_type: string;
};

interface LinkPostThumbnail
{
	thumbnail: string;
	thumbnail_height: any | null; // Likely `number | null`
	thumbnail_width: any | null; // Likely `number | null`
};

export type LinkPost = PostCommentShared & LinkPostFlair & LinkPostThumbnail & {
	allow_live_comments: boolean;
	category: any | null;
	clicked: boolean;
	content_categories: any | null;
	discussion_type: any | null;
	domain: string;
	hidden: boolean;
	hide_score: boolean;
	is_crosspostable: boolean;
	is_meta: boolean;
	is_original_content: boolean;
	is_reddit_media_domain: boolean;
	is_robot_indexable: boolean;
	is_self: boolean;
	is_video: boolean
	media: any | null;
	media_embed: any; // Defaults to {}
	media_only: boolean;
	num_comments: number;
	num_crossposts: number;
	over_18: boolean;
	parent_whitelist_status: string;
	pinned: boolean;
	pwls: number;
	quarantine: boolean;
	removed_by: any | null; // Likely `User | null`
	removed_by_category: any | null;
	secure_media: any | null;
	secure_media_embed: any; // Defaults to {}
	selftext: string;
	selftext_html: string;
	spoiler: boolean;
	subreddit_subscribers: number;
	suggested_sort: string; // Could this be an enum? "new", "hot", "top"?
	title: string;
	upvote_ratio: number;
	url: string;
	view_count: any | null; // Likely number | null
	visited: boolean;
	whitelist_status: string;
	wls: number;
};

export interface CommentJson
{
	kind: string; // = "t1"
	data: Comment;
};

export interface CommentResponseJson
{
	kind: string // = "Listing"
	data: {
		children: CommentJson[];
		after: string;
		before: string;
		modhash: string;
		dist: any | null; // Likely `number | null`
	};
};

export interface LinkPostJson
{
	kind: string; // = "t3"
	data: LinkPost;
};

export interface SubredditPostResponseJson
{
	kind: string; // = "Listing"
	data: {
		children: LinkPostJson[];
		after: string;
		before: string;
		modhash: string;
		dist: any | null; // Likely `number | null`
	};
};

export type PostResponseJson = [SubredditPostResponseJson, CommentResponseJson];
