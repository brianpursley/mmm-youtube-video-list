Module.register("mmm-youtube-video-list", {
	defaults: {
		apiKey: "",
		channelIds: [],
		updateInterval: 300_000,
		videoCount: 10,
		dateFormat: "MMM Do h:mm A"
	},

	getScripts: function () {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			"mmm-youtube-video-list.css",
		];
	},

	start: function () {
		this.error = null;
		this.videos = null;
		this.getVideos();
		setInterval(() => {
			this.getVideos();
		}, this.config.updateInterval);
	},

	getVideos: async function () {
		try {
			const videos = await Promise.all(
				this.config.channelIds.map(c => this.getLatestVideos(c))
			);
			let allVideos = videos.flat();
			allVideos.sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1)); // Newest first
			this.videos = allVideos.slice(0, this.config.videoCount);
			this.error = null;
		} catch (error) {
			this.error = error;
			console.error(error);
		} finally {
			this.updateDom();
		}
	},

	getLatestVideos: async function (channelId) {
		const playlistId = 'UU' + channelId.slice(2);
		const baseUrl = "https://www.googleapis.com/youtube/v3/playlistItems";
		const queryParams = `?part=snippet&maxResults=${this.config.videoCount}&playlistId=${playlistId}&key=${this.config.apiKey}`;
		const response = await fetch(baseUrl + queryParams);
		console.log(response);
		if (response.status !== 200) {
			throw new Error(`Error fetching videos for channel ${channelId}: ${response.status} ${response.statusText}`);
		}
		const data = await response.json();
		if (data.items) {
			return data.items.map(item => item.snippet);
		}
		return [];
	},

	getDom: function () {
		const wrapper = document.createElement("div");

		console.dir(this.error);
		if (this.error) {
			wrapper.innerHTML = this.error.message;
			return wrapper;
		}

		if (this.videos === null) {
			wrapper.innerHTML = "Loading...";
			return wrapper;
		}

		if (this.videos.length === 0) {
			wrapper.innerHTML = "No videos found";
			return wrapper;
		}

		this.videos.forEach(video => {
			const date = moment(video.publishedAt);
			const formattedDate = date.format(this.config.dateFormat);
			const item = document.createElement("div");
			item.className = 'video';
			item.innerHTML = `<div class="title"><strong>${video.channelTitle}: ${video.title}</strong></div><div class="pubDate">${formattedDate}</div>`;
			wrapper.appendChild(item);
		});
		return wrapper;
	}
});
