# mmm-youtube-video-list

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/).

It displays a list of the most recent videos from the specified YouTube channels.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:
```js
var config = {
    modules: [
        {
            module: 'mmm-youtube-video-list',
            config: {
                // See below for configurable options
            }
        }
    ]
}
```

## Configuration options

| Option           | Description
|----------------- |-----------
| `apiKey`         | *Required* This is your YouTube API key
| `channelIds`     | *Required* The list of channel IDs you want to get the latest videos for
| `updateInterval` | *Optional* The time in milliseconds between calls to get the latest videos <br><br>**Type:** `int`(milliseconds) <br>Default 300000 milliseconds (5 minutes)
| `videoCount`     | *Optional* The maximum number of videos to show <br><br>**Type:** `int` <br>Default 10
| `dateFormat`     | *Optional* The date format to use when displaying videos <br>Default "MMM Do h:mm A"



