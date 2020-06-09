import React from 'react';

const SelectSubreddit = (
	{subreddit, setSubreddit}
	: {subreddit: string, setSubreddit: (_: string) => void}
) => {
	const [sr, setSr] = React.useState("");

	React.useEffect(() => {
		setSr(subreddit);
	}, [subreddit]);

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		setSubreddit(sr);
	};
	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setSr(event.target.value);

	return (
		<form onSubmit={handleSubmit}>
			Select subreddit:
			{/*<textarea value={sr} onChange={handleChange} style={{"rows": 1} as React.CSSProperties}/>*/}
			<input type="text" onChange={handleChange} value={sr} />
			<button type="submit">Go to subreddit!</button>
		</form>
	);
}

export default SelectSubreddit;
