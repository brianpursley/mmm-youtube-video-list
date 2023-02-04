Module.register("mmm-youtube-video-list", {
	defaults: {
	  apiKey: "",
	  channels: [],
	  updateInterval: 60000,
	  videoCount: 10,
	  dateFormat: 'LLL'
	},
  
	getScripts: function() {
		return ["moment.js"];
	},

	getStyles: function () {
		return [
			"mmm-youtube-video-list.css",
		];
	},

	// Load translations files
	getTranslations: function() {
		//FIXME: This can be load a one file javascript definition
		return {
			en: "translations/en.json",
			es: "translations/es.json"
		};
	},

	start: function() {
	//   this.videos = [];
	//   this.getVideos();
	//   setInterval(() => {
	// 	this.getVideos();
	//   }, this.config.updateInterval);
	},
  
	getVideos: async function() {
	  try {
		const videos = await Promise.all(
		  this.config.channels.map(c => this.getLatestVideos(c))
		);
		this.videos = videos.flat();
		this.updateDom();
	  } catch (error) {
		console.error(error);
	  }
	},

	getChannelId: async function(channelName) {
		const baseUrl = "https://www.googleapis.com/youtube/v3/search";
		const queryParams = `?part=id&q=${channelName}&type=channel&key=${this.config.apiKey}`;
		const response = await fetch(baseUrl + queryParams);
		const data = await response.json();
		if (!data.items || !data.items.length) {
			throw new Error(`Channel not found: ${channelName}`);
		}
		return data.items[0].id;
	},

	getLatestVideos: async function(channelName) {
	  const channelId = await this.getChannelId(channelName);
	  const baseUrl = "https://www.googleapis.com/youtube/v3/search";
	  const queryParams = `?part=snippet&maxResults=${this.config.videoCount}&channelId=${channelId}&order=date&key=${this.config.apiKey}`;
	  const response = await fetch(baseUrl + queryParams);
	  const data = await response.json();
	  return data.items.map(item => item.snippet);
	},
  
	getDom: function() {
		const wrapper = document.createElement("div");
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
  