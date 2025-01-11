# Transistor API Reference
The Transistor API is built around the [JSON:API](https://jsonapi.org/) specification. Our API allows you to work with podcasts, episodes, private podcast subscribers, and analytics. Endpoints accept JSON or form-encoded request bodies, return JSON-encoded responses, and use standard HTTP response codes.

Authentication[](#authentication "Link to this section")
--------------------------------------------------------

The Transistor API uses API keys to authenticate all requests. Your API keys can be viewed and reset in the [Account Area](https://dashboard.transistor.fm/account) of your Transistor Dashboard. Each API request must include an HTTP header `x-api-key` with its value being your API key.

Authenticated requests grant you access to any podcast or episode you would have access to through the Dashboard, along with the same level of access depending on if you're an owner, an admin, or a regular team member of a podcast.

* * *

Rate Limits[](#ratelimits "Link to this section")
-------------------------------------------------

API requests are rate-limited to 10 requests per 10 seconds. If this limit is exceeded, you will be receive a `429` HTTP error code, and access will be blocked for 10 seconds. After these 10 seconds, you are free to use the API again.

If you are continually hitting the rate-limit, please review your use of the API and always cache responses when possible. The Transistor API is not meant to be the main data source for website content. If this is what you're looking for, you may want to simply parse the XML from your RSS Feed.

* * *

Endpoints[](#endpoints "Link to this section")
----------------------------------------------

Because our API conforms to the [JSON:API](https://jsonapi.org/) spec, each endpoint also accepts extra parameters that can be helpful in certain scenarios: **sparse fieldsets** and **including related resources**. We've included examples of these in some of our example requests and responses.

### Sparse fieldsets

Sometimes you may wish to only have a handful of a resource's fields be returned from an API request, instead of the entire resource. Let's say you want to retrieve an Episode but only return the title and media\_url. In your request you can specify `fields[episode][]=title&fields[episode][]=media_url`.

### Including related resources

You can also return a resource's related resources in one single API request instead of multiuple requests. For example, you may want to retrieve an Episode, but also include its parent Show resource. In your request you can specify `include[]=show`. You can also combine this with sparse fieldsets to request an Episode's related Show, but only return the Show's title and RSS Feed URL, for example. `include[]=show&fields[show][]=title&fields[show][]=feed_url`.

### Root[](#root "Link to this section")

Get authenticated user[](#get-v1 "Link to this endpoint")
---------------------------------------------------------

Retrieve details of the user account that is authenticating to the API.

`GET /v1`

Response
--------

A single [User resource](#User)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1 -G \
  -H "x-api-key: your_api_key"
```
`

### Response

````
$ {
  "data": {
    "id": "173455",
    "type": "user",
    "attributes": {
      "created_at": "2020-01-01 00:00:00 UTC",
      "image_url": null,
      "name": "Jimmy Podcaster",
      "time_zone": "UTC",
      "updated_at": "2020-06-01 00:00:00 UTC"
    }
  }
}
```
`

### Analytics[](#analytics "Link to this section")

Get show analytics[](#get-v1-analytics-id "Link to this endpoint")
------------------------------------------------------------------

Retrieve analytics of downloads per day for an entire podcast. Defaults to the last 14 days.

`GET /v1/analytics/:id`

Parameters
----------



* Field:           id            Required        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           start_date        
  * Type: String
  * Details:         
  * Description: Optional starting date for analytics (dd-mm-yyyy). Required if using an ending date.
* Field:           end_date        
  * Type: String
  * Details:         
  * Description: Optional ending date for analytics (dd-mm-yyyy). Required if using a starting date.


Response
--------

A single [ShowAnalytics resource](#ShowAnalytics)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/analytics/132543 -G \
  -H "x-api-key: your_api_key" \
  -d start_date=01-01-2020 \
  -d end_date=31-12-2020 \
  -d "include[]=show" \
  -d "fields[show][]=title"
```
`

### Response

````
$ {
  "data": {
    "id": "the-caffeine-show",
    "type": "show_analytics",
    "attributes": {
      "downloads": [
        {
          "date": "30-11-2024",
          "downloads": 0
        },
        {
          "date": "01-12-2024",
          "downloads": 0
        },
        {
          "date": "02-12-2024",
          "downloads": 0
        },
        {
          "date": "03-12-2024",
          "downloads": 0
        },
        {
          "date": "04-12-2024",
          "downloads": 0
        },
        {
          "date": "05-12-2024",
          "downloads": 0
        },
        {
          "date": "06-12-2024",
          "downloads": 0
        },
        {
          "date": "07-12-2024",
          "downloads": 0
        },
        {
          "date": "08-12-2024",
          "downloads": 0
        },
        {
          "date": "09-12-2024",
          "downloads": 0
        },
        {
          "date": "10-12-2024",
          "downloads": 0
        },
        {
          "date": "11-12-2024",
          "downloads": 0
        },
        {
          "date": "12-12-2024",
          "downloads": 0
        },
        {
          "date": "13-12-2024",
          "downloads": 0
        }
      ],
      "start_date": "11-30-2024",
      "end_date": "12-13-2024"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  },
  "included": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show"
      },
      "relationships": {}
    }
  ]
}
```
`

Get all episode analytics[](#get-v1-analytics-id-episodes "Link to this endpoint")
----------------------------------------------------------------------------------

Retrieve analytics of downloads per day for all episodes of a podcast. Defaults to the last 7 days.

`GET /v1/analytics/:id/episodes`

Parameters
----------



* Field:           id            Required        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           start_date        
  * Type: String
  * Details:         
  * Description: Optional starting date for analytics (dd-mm-yyyy). Required if using an ending date.
* Field:           end_date        
  * Type: String
  * Details:         
  * Description: Optional ending date for analytics (dd-mm-yyyy). Required if using a starting date.


Response
--------

A single [EpisodesAnalytics resource](#EpisodesAnalytics)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/analytics/132543/episodes -G \
  -H "x-api-key: your_api_key" \
  -d start_date=01-01-2021 \
  -d end_date=07-01-2021 \
  -d "include[]=show" \
  -d "fields[show][]=title"
```
`

### Response

````
$ {
  "data": {
    "id": "the-caffeine-show",
    "type": "episodes_analytics",
    "attributes": {
      "episodes": [
        {
          "id": 2,
          "title": "Episode Two",
          "published_at": "2024-12-05 14:01:43 UTC",
          "downloads": [
            {
              "date": "11-30-2024",
              "downloads": 0
            },
            {
              "date": "12-01-2024",
              "downloads": 0
            },
            {
              "date": "12-02-2024",
              "downloads": 0
            },
            {
              "date": "12-03-2024",
              "downloads": 0
            },
            {
              "date": "12-04-2024",
              "downloads": 0
            },
            {
              "date": "12-05-2024",
              "downloads": 0
            },
            {
              "date": "12-06-2024",
              "downloads": 0
            }
          ]
        },
        {
          "id": 1,
          "title": "Episode One",
          "published_at": "2024-12-03 14:01:43 UTC",
          "downloads": [
            {
              "date": "11-30-2024",
              "downloads": 0
            },
            {
              "date": "12-01-2024",
              "downloads": 0
            },
            {
              "date": "12-02-2024",
              "downloads": 0
            },
            {
              "date": "12-03-2024",
              "downloads": 0
            },
            {
              "date": "12-04-2024",
              "downloads": 0
            },
            {
              "date": "12-05-2024",
              "downloads": 0
            },
            {
              "date": "12-06-2024",
              "downloads": 0
            }
          ]
        }
      ],
      "start_date": "11-30-2024",
      "end_date": "12-06-2024"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  },
  "included": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show"
      },
      "relationships": {}
    }
  ]
}
```
`

Get single episode analytics[](#get-v1-analytics-episodes-id "Link to this endpoint")
-------------------------------------------------------------------------------------

Retrieve analytics of downloads per day for a single episode. Defaults to the last 14 days.

`GET /v1/analytics/episodes/:id`

Parameters
----------



* Field:           id            Required        
  * Type: String
  * Details:         
  * Description: Episode ID or slug
* Field:           start_date        
  * Type: String
  * Details:         
  * Description: Optional starting date for analytics (dd-mm-yyyy). Required if using an ending date.
* Field:           end_date        
  * Type: String
  * Details:         
  * Description: Optional ending date for analytics (dd-mm-yyyy). Required if using a starting date.


Response
--------

A single [EpisodeAnalytics resource](#EpisodeAnalytics)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/analytics/episodes/3056098 -G \
  -H "x-api-key: your_api_key" \
  -d start_date=01-01-2020 \
  -d end_date=31-12-2020 \
  -d "include[]=episode" \
  -d "fields[episode][]=title"
```
`

### Response

````
$ {
  "data": {
    "id": "3056098",
    "type": "episode_analytics",
    "attributes": {
      "downloads": [
        {
          "date": "30-11-2024",
          "downloads": 0
        },
        {
          "date": "01-12-2024",
          "downloads": 0
        },
        {
          "date": "02-12-2024",
          "downloads": 0
        },
        {
          "date": "03-12-2024",
          "downloads": 0
        },
        {
          "date": "04-12-2024",
          "downloads": 0
        },
        {
          "date": "05-12-2024",
          "downloads": 0
        },
        {
          "date": "06-12-2024",
          "downloads": 0
        },
        {
          "date": "07-12-2024",
          "downloads": 0
        },
        {
          "date": "08-12-2024",
          "downloads": 0
        },
        {
          "date": "09-12-2024",
          "downloads": 0
        },
        {
          "date": "10-12-2024",
          "downloads": 0
        },
        {
          "date": "11-12-2024",
          "downloads": 0
        },
        {
          "date": "12-12-2024",
          "downloads": 0
        },
        {
          "date": "13-12-2024",
          "downloads": 0
        }
      ],
      "start_date": "11-30-2024",
      "end_date": "12-13-2024"
    },
    "relationships": {
      "episode": {
        "data": {
          "id": "3056098",
          "type": "episode"
        }
      }
    }
  },
  "included": [
    {
      "id": "3056098",
      "type": "episode",
      "attributes": {
        "title": "How To Roast Coffee"
      },
      "relationships": {}
    }
  ]
}
```
`

### Episodes[](#episodes "Link to this section")

Get episodes[](#get-v1-episodes "Link to this endpoint")
--------------------------------------------------------

Retrieve a paginated list of episodes ordered by published date.

`GET /v1/episodes`

Parameters
----------



* Field:           show_id        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           query        
  * Type: String
  * Details:         
  * Description: Search query
* Field:           status        
  * Type: String
  * Details:             One of                                  
  * Description: Publishing status: published, scheduled, or draft
* Field:           order        
  * Type: String
  * Details:             One of                                      Default:                          desc                    
  * Description: Return order of episodes. Newest first (desc), or oldest first (asc)
* Field:           pagination[page]        
  * Type: Integer
  * Details:             Default:                          0                    
  * Description: Page number
* Field:           pagination[per]        
  * Type: Integer
  * Details:             Default:                          10                    
  * Description: Resources per page


Response
--------

An array of [Episode resources](#Episode)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/episodes -G \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d "pagination[page]=1" \
  -d "pagination[per]=5" \
  -d "fields[episode][]=title" \
  -d "fields[episode][]=published_at"
```
`

### Response

````
$ {
  "data": [
    {
      "id": "3056098",
      "type": "episode",
      "attributes": {
        "title": "How To Roast Coffee",
        "published_at": "2020-07-01 00:00:00 UTC"
      },
      "relationships": {}
    },
    {
      "id": "3056099",
      "type": "episode",
      "attributes": {
        "title": "The Effects of Caffeine",
        "published_at": "2020-07-01 00:00:00 UTC"
      },
      "relationships": {}
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 2
  }
}
```
`

Get an episode[](#get-v1-episodes-id "Link to this endpoint")
-------------------------------------------------------------

Retrieve a single podcast episode.

`GET /v1/episodes/:id`

Parameters
----------


|Field                                   |Type  |Details |Description|
|----------------------------------------|------|--------|-----------|
|          id            Required        |String|        |Episode ID |


Response
--------

A single [Episode resource](#Episode)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/episodes/3056098 -G \
  -H "x-api-key: your_api_key" \
  -d "include[]=show" \
  -d "fields[show][]=title" \
  -d "fields[show][]=summary"
```
`

### Response

````
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "title": "How To Roast Coffee",
      "number": 1,
      "season": 1,
      "status": "published",
      "published_at": "2020-07-01 00:00:00 UTC",
      "duration": 568,
      "explicit": false,
      "keywords": "coffee,caffeine,beans",
      "alternate_url": null,
      "media_url": "https://media.transistor.fm/af3e966c/43bc35ee.mp3",
      "image_url": null,
      "video_url": "https://www.youtube.com/watch?v=xcyHT1ZLd9Y",
      "author": "Jimmy Podcaster",
      "summary": "A primer on roasting coffee",
      "description": "This podcast talks about some <strong>strong</strong> coffee!",
      "slug": null,
      "created_at": "2020-03-01 00:00:00 UTC",
      "updated_at": "2020-03-01 00:00:00 UTC",
      "formatted_published_at": "July 1, 2020",
      "duration_in_mmss": "09:28",
      "share_url": "https://share.transistor.fm/s/af3e966c",
      "transcript_url": null,
      "transcripts": [],
      "formatted_summary": "A primer on roasting coffee",
      "formatted_description": "This podcast talks about some <strong>strong</strong> coffee!",
      "embed_html": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/af3e966c\"></iframe>",
      "embed_html_dark": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/af3e966c/dark\"></iframe>",
      "audio_processing": false,
      "type": "full",
      "email_notifications": null
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  },
  "included": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show"
      },
      "relationships": {}
    }
  ]
}
```
`

Authorize an episode audio upload[](#get-v1-episodes-authorize_upload "Link to this endpoint")
----------------------------------------------------------------------------------------------

Authorize a URL for uploading a local audio file to be used when creating or updating an episode. If you already have a publicly available URL for your audio file, skip this step and use that URL in the `episode[audio_url]` field when creating or updating an episode.

`GET /v1/episodes/authorize_upload`

Parameters
----------



* Field:           filename            Required        
  * Type: String
  * Details:         
  * Description: Filename of the audio file you wish to upload


Response
--------

A single [AudioUpload resource](#AudioUpload)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/episodes/authorize_upload -G \
  -H "x-api-key: your_api_key" \
  -d filename=Episode1.mp3
```
`

### Response

````
$ {
  "data": {
    "id": "f61f26fb-ac59-4eb0-9f02-213e7d2b99ee",
    "type": "audio_upload",
    "attributes": {
      "upload_url": "https://transistorupload.s3.amazonaws.com/588ea179cb09e23eaf331d12f600ab9e.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJNPH...%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20240402T175744Z&X-Amz-Expires=600&X-Amz-SignedHeaders=host&X-Amz-Signature=0c3bf1...",
      "content_type": "audio/mpeg",
      "expires_in": 600,
      "audio_url": "https://transistorupload.s3.amazonaws.com/588ea179cb09e23eaf331d12f600ab9e.mp3"
    }
  }
}
```
`

Uploading an Audio File using an upload\_url and content\_type
--------------------------------------------------------------

Upload your audio file however you wish but it must be a PUT method HTTP request with the `content_type` of the audio file included as a header. After a successful 200 response, you may then use the `audio_url` as the `episode[audio_url]` when creating or updating an episode.

### CURL Example

````
$ curl -v -X PUT \
  -H "Content-Type: audio/mpeg" \
  -T /path/to/your/audio/Episode1.mp3 \
  "upload_url_from_authorize_upload"
```
`

### Ruby Example

````
require "net/http"

file = "/path/to/your/audio/Episode1.mp3"
presigned_url = "upload_url_from_authorize_upload"
url = URI.parse(presigned_url)

Net::HTTP.start(url.host) do |http|
  http.send_request("PUT", url.request_uri, File.read(file), { "content-type" => "audio/mpeg" })
end
```
`

Create an episode[](#post-v1-episodes "Link to this endpoint")
--------------------------------------------------------------

Create a new draft episode for the specified show. Note that publishing an episode involves a separate endpoint.

`POST /v1/episodes`

Parameters
----------



* Field:           episode[show_id]            Required        
  * Type: String
  * Details:         
  * Description: ID or Slug of the Show to add an episode to
* Field:           episode[audio_url]        
  * Type: String
  * Details:         
  * Description: URL to an episode's new audio file
* Field:           episode[transcript_text]        
  * Type: String
  * Details:         
  * Description: Full text of the episode transcript
* Field:           episode[author]        
  * Type: String
  * Details:         
  * Description: Episode author
* Field:           episode[description]        
  * Type: String
  * Details:         
  * Description: Longer episode description which may contain HTML and unformatted tags for chapters, people, supporters, etc
* Field:           episode[explicit]        
  * Type: Boolean
  * Details:         
  * Description: Episode contains explicit content
* Field:           episode[image_url]        
  * Type: String
  * Details:         
  * Description: Episode artwork image URL
* Field:           episode[keywords]        
  * Type: String
  * Details:         
  * Description: Comma-separated list of keywords
* Field:           episode[number]        
  * Type: Integer
  * Details:         
  * Description: Episode number
* Field:           episode[season]        
  * Type: Integer
  * Details:         
  * Description: Season number
* Field:           episode[summary]        
  * Type: String
  * Details:         
  * Description: Episode summary short description
* Field:           episode[type]        
  * Type: String
  * Details:             One of                                  
  * Description: Full, trailer, or bonus episode
* Field:           episode[title]        
  * Type: String
  * Details:         
  * Description: Episode title
* Field:           episode[alternate_url]        
  * Type: String
  * Details:         
  * Description: Alternate episode URL overriding the share_url
* Field:           episode[video_url]        
  * Type: String
  * Details:         
  * Description: YouTube video URL to be embedded on episode sharing pages and website pages
* Field:           episode[email_notifications]        
  * Type: Boolean
  * Details:         
  * Description: Private podcast email notifications override (defaults to Show setting)
* Field:           episode[increment_number]        
  * Type: Boolean
  * Details:         
  * Description: Automatically set the number to the next episode number of the current season


Response
--------

A single [Episode resource](#Episode)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/episodes -X POST \
  -H "x-api-key: your_api_key" \
  -d "episode[show_id]=132543" \
  -d "episode[title]=Awesome podcast" \
  -d "episode[summary]=A podcast about awesome things" \
  -d "episode[season]=2" \
  -d "episode[number]=1"
```
`

### Response

````
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "title": "Awesome podcast",
      "number": 1,
      "season": 2,
      "status": "draft",
      "published_at": null,
      "duration": null,
      "explicit": false,
      "keywords": null,
      "alternate_url": null,
      "media_url": "https://media.transistor.fm/47d59efd/3786c02d.mp3",
      "image_url": null,
      "video_url": null,
      "author": null,
      "summary": "A podcast about awesome things",
      "description": null,
      "slug": null,
      "created_at": "2024-12-13 14:01:43 UTC",
      "updated_at": "2024-12-13 14:01:43 UTC",
      "formatted_published_at": null,
      "duration_in_mmss": "00:00",
      "share_url": "https://share.transistor.fm/s/47d59efd",
      "transcript_url": null,
      "transcripts": [],
      "formatted_summary": "A podcast about awesome things",
      "formatted_description": "",
      "embed_html": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/47d59efd\"></iframe>",
      "embed_html_dark": "<iframe width=\"100%\" height=\"180\" frameborder=\"no\" scrolling=\"no\" seamless src=\"https://share.transistor.fm/e/47d59efd/dark\"></iframe>",
      "audio_processing": false,
      "type": "full",
      "email_notifications": null
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```
`

Update an episode[](#patch-v1-episodes-id "Link to this endpoint")
------------------------------------------------------------------

Update a single podcast episode. Note that publishing or unpublishing an episode involves a separate endpoint.

`PATCH /v1/episodes/:id`

Parameters
----------



* Field:           id            Required        
  * Type: String
  * Details:         
  * Description: Episode ID
* Field:           episode[audio_url]        
  * Type: String
  * Details:         
  * Description: URL to an episode's new audio file
* Field:           episode[transcript_text]        
  * Type: String
  * Details:         
  * Description: Full text of the episode transcript
* Field:           episode[author]        
  * Type: String
  * Details:         
  * Description: Episode author
* Field:           episode[description]        
  * Type: String
  * Details:         
  * Description: Longer episode description which may contain HTML and unformatted tags for chapters, people, supporters, etc
* Field:           episode[explicit]        
  * Type: Boolean
  * Details:         
  * Description: Episode contains explicit content
* Field:           episode[image_url]        
  * Type: String
  * Details:         
  * Description: Episode artwork image URL
* Field:           episode[keywords]        
  * Type: String
  * Details:         
  * Description: Comma-separated list of keywords
* Field:           episode[number]        
  * Type: Integer
  * Details:         
  * Description: Episode number
* Field:           episode[season]        
  * Type: Integer
  * Details:         
  * Description: Season number
* Field:           episode[summary]        
  * Type: String
  * Details:         
  * Description: Episode summary short description
* Field:           episode[type]        
  * Type: String
  * Details:             One of                                  
  * Description: Full, trailer, or bonus episode
* Field:           episode[title]        
  * Type: String
  * Details:         
  * Description: Episode title
* Field:           episode[alternate_url]        
  * Type: String
  * Details:         
  * Description: Alternate episode URL overriding the share_url
* Field:           episode[video_url]        
  * Type: String
  * Details:         
  * Description: YouTube video URL to be embedded on episode sharing pages and website pages
* Field:           episode[email_notifications]        
  * Type: Boolean
  * Details:         
  * Description: Private podcast email notifications override (defaults to Show setting)


Response
--------

A single [Episode resource](#Episode)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/episodes/3056098 -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "episode[title]=Updated podcast" \
  -d "fields[episode][]=title"
```
`

### Response

````
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "title": "Updated podcast"
    },
    "relationships": {}
  }
}
```
`

Publish, schedule, or unpublish an episode[](#patch-v1-episodes-id-publish "Link to this endpoint")
---------------------------------------------------------------------------------------------------

Publish a single episode now or in the past, schedule for the future, or revert to a draft.

`PATCH /v1/episodes/:id/publish`

Parameters
----------



* Field:           id            Required        
  * Type: String
  * Details:         
  * Description: Episode ID
* Field:           episode[status]            Required        
  * Type: String
  * Details:             One of                                  
  * Description: Publishing status: published, scheduled, or draft
* Field:           episode[published_at]        
  * Type: String
  * Details:         
  * Description: Episode publishing date and time - in your podcast's time zone


Response
--------

A single [Episode resource](#Episode)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/episodes/3056098/publish -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "episode[status]=published" \
  -d "fields[episode][]=status"
```
`

### Response

````
$ {
  "data": {
    "id": "3056098",
    "type": "episode",
    "attributes": {
      "status": "published"
    },
    "relationships": {}
  }
}
```
`

### Shows[](#shows "Link to this section")

Get shows[](#get-v1-shows "Link to this endpoint")
--------------------------------------------------

Retrieve a paginated list of shows in descending order by updated date.

`GET /v1/shows`

Parameters
----------



* Field:           private        
  * Type: Boolean
  * Details:         
  * Description: Filter for private shows
* Field:           query        
  * Type: String
  * Details:         
  * Description: Search query
* Field:           pagination[page]        
  * Type: Integer
  * Details:             Default:                          0                    
  * Description: Page number
* Field:           pagination[per]        
  * Type: Integer
  * Details:             Default:                          10                    
  * Description: Resources per page


Response
--------

An array of [Show resources](#Show)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/shows -G \
  -H "x-api-key: your_api_key" \
  -d "pagination[page]=1" \
  -d "pagination[per]=5" \
  -d "fields[show][]=title" \
  -d "fields[show][]=description"
```
`

### Response

````
$ {
  "data": [
    {
      "id": "132543",
      "type": "show",
      "attributes": {
        "title": "The Caffeine Show",
        "description": "A podcast covering all things coffee and caffeine"
      },
      "relationships": {}
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 1
  }
}
```
`

Get a show[](#get-v1-shows-id "Link to this endpoint")
------------------------------------------------------

Retrive a single show (podcast).

`GET /v1/shows/:id`

Parameters
----------


|Field                                   |Type  |Details |Description    |
|----------------------------------------|------|--------|---------------|
|          id            Required        |String|        |Show ID or slug|


Response
--------

A single [Show resource](#Show)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/shows/132543 -G \
  -H "x-api-key: your_api_key"
```
`

### Response

````
$ {
  "data": {
    "id": "132543",
    "type": "show",
    "attributes": {
      "author": null,
      "category": "Arts :: Food",
      "copyright": null,
      "created_at": "2020-02-01 00:00:00 UTC",
      "description": "A podcast covering all things coffee and caffeine",
      "explicit": false,
      "image_url": null,
      "keywords": "coffee,caffeine,beans",
      "language": "en",
      "multiple_seasons": false,
      "owner_email": null,
      "playlist_limit": 25,
      "private": false,
      "secondary_category": "Arts",
      "show_type": "episodic",
      "slug": "the-caffeine-show",
      "time_zone": null,
      "title": "The Caffeine Show",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "website": null,
      "feed_url": "https://feeds.transistor.fm/the-caffeine-show",
      "apple_podcasts": null,
      "amazon_music": null,
      "deezer": null,
      "spotify": null,
      "podcast_addict": null,
      "player_FM": null,
      "anghami": null,
      "castbox": null,
      "castro": null,
      "goodpods": null,
      "iHeartRadio": null,
      "overcast": null,
      "pandora": null,
      "pocket_casts": null,
      "soundcloud": null,
      "tuneIn": null,
      "fountain": null,
      "jiosaavn": null,
      "gaana": null,
      "email_notifications": false
    },
    "relationships": {
      "episodes": {
        "data": []
      }
    }
  }
}
```
`

Update a show[](#patch-v1-shows-id "Link to this endpoint")
-----------------------------------------------------------

Update a show with any or all of the following attributes.

`PATCH /v1/shows/:id`

Parameters
----------



* Field:           id            Required        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           show[author]        
  * Type: String
  * Details:         
  * Description: Podcast author
* Field:           show[category]        
  * Type: String
  * Details:             One of                                  
  * Description: Primary category
* Field:           show[copyright]        
  * Type: String
  * Details:         
  * Description: Copyright information
* Field:           show[description]        
  * Type: String
  * Details:         
  * Description: Podcast description
* Field:           show[explicit]        
  * Type: Boolean
  * Details:         
  * Description: Podcast contains explicit content
* Field:           show[image_url]        
  * Type: String
  * Details:         
  * Description: Podcast artwork image URL
* Field:           show[keywords]        
  * Type: String
  * Details:         
  * Description: Comma-separated list of keywords
* Field:           show[language]        
  * Type: String
  * Details:             One of                                  
  * Description: Podcast's spoken language
* Field:           show[owner_email]        
  * Type: String
  * Details:         
  * Description: Podcast owner email
* Field:           show[secondary_category]        
  * Type: String
  * Details:             One of                                  
  * Description: Secondary category
* Field:           show[show_type]        
  * Type: String
  * Details:             One of                                  
  * Description: Publishing type. Episodic displays newest episodes, serial displays oldest first
* Field:           show[title]        
  * Type: String
  * Details:         
  * Description: Podcast title
* Field:           show[time_zone]        
  * Type: String
  * Details:             One of                                  
  * Description: Publishing time zone
* Field:           show[website]        
  * Type: String
  * Details:         
  * Description: Podcast website


Response
--------

A single [Show resource](#Show)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/shows/132543 -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "show[title]=Updated Title" \
  -d "show[author]=Updated Author" \
  -d "fields[show][]=title" \
  -d "fields[show][]=author"
```
`

### Response

````
$ {
  "data": {
    "id": "132543",
    "type": "show",
    "attributes": {
      "title": "Updated Title",
      "author": "Updated Author"
    },
    "relationships": {}
  }
}
```
`

### Subscribers[](#subscribers "Link to this section")

Get a list of subscribers[](#get-v1-subscribers "Link to this endpoint")
------------------------------------------------------------------------

Retrieve a list of all subscribers for a single private podcast.

`GET /v1/subscribers`

Parameters
----------



* Field:           show_id            Required        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           query        
  * Type: String
  * Details:         
  * Description: Search query
* Field:           pagination[page]        
  * Type: Integer
  * Details:             Default:                          0                    
  * Description: Page number
* Field:           pagination[per]        
  * Type: Integer
  * Details:             Default:                          10                    
  * Description: Resources per page


Response
--------

An array of [Subscriber resources](#Subscriber)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/subscribers -G \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d "pagination[page]=1" \
  -d "pagination[per]=5" \
  -d "fields[subscriber][]=email"
```
`

### Response

````
$ {
  "data": [
    {
      "id": "709423",
      "type": "subscriber",
      "attributes": {
        "email": "arthur@example.com"
      },
      "relationships": {}
    },
    {
      "id": "709424",
      "type": "subscriber",
      "attributes": {
        "email": "beatrice@example.com"
      },
      "relationships": {}
    }
  ],
  "meta": {
    "currentPage": 1,
    "totalPages": 1,
    "totalCount": 2
  }
}
```
`

Retrieve a single private podcast subscriber.[](#get-v1-subscribers-id "Link to this endpoint")
-----------------------------------------------------------------------------------------------

`GET /v1/subscribers/:id`

Parameters
----------


|Field                                   |Type  |Details |Description  |
|----------------------------------------|------|--------|-------------|
|          id            Required        |String|        |Subscriber ID|


Response
--------

A single [Subscriber resource](#Subscriber)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/subscribers/709423 -G \
  -H "x-api-key: your_api_key"
```
`

### Response

````
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "arthur@example.com",
      "status": "default",
      "feed_url": "https://subscribers.transistor.fm/45ac840ad67713",
      "created_at": "2020-01-01 00:00:00 UTC",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "last_notified_at": "2020-07-01 00:00:00 UTC",
      "has_downloads": false,
      "subscribe_url": "https://subscribe.transistor.fm/45ac840ad67713"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```
`

Create a single subscriber[](#post-v1-subscribers "Link to this endpoint")
--------------------------------------------------------------------------

Add a single subscriber to a private podcast, and send an optional instructional email.

`POST /v1/subscribers`

Parameters
----------



* Field:           show_id            Required        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           email            Required        
  * Type: String
  * Details:         
  * Description: Email address
* Field:           skip_welcome_email        
  * Type: Boolean
  * Details:             Default:                          false                    
  * Description: Do not send the instructional email


Response
--------

A single [Subscriber resource](#Subscriber)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/subscribers -X POST \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d email=carol@example.com \
  -d "fields[subscriber][]=email"
```
`

### Response

````
$ {
  "data": {
    "id": "709427",
    "type": "subscriber",
    "attributes": {
      "email": "carol@example.com"
    },
    "relationships": {}
  }
}
```
`

Create multiple subscribers[](#post-v1-subscribers-batch "Link to this endpoint")
---------------------------------------------------------------------------------

Add a batch of multiple subscribers to a private podcast, and send them optional instructional emails.

`POST /v1/subscribers/batch`

Parameters
----------



* Field:           show_id            Required        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           emails            Required        
  * Type: [String]
  * Details:         
  * Description: Array of email addresses
* Field:           skip_welcome_email        
  * Type: Boolean
  * Details:             Default:                          false                    
  * Description: Do not send the instructional emails


Response
--------

An array of [Subscriber resources](#Subscriber)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/subscribers/batch -X POST \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d "emails[]=carol@example.com" \
  -d "emails[]=derek@example.com" \
  -d "fields[subscriber][]=email"
```
`

### Response

````
$ {
  "data": [
    {
      "id": "709427",
      "type": "subscriber",
      "attributes": {
        "email": "carol@example.com"
      },
      "relationships": {}
    },
    {
      "id": "709428",
      "type": "subscriber",
      "attributes": {
        "email": "derek@example.com"
      },
      "relationships": {}
    }
  ]
}
```
`

Update a single subscriber[](#patch-v1-subscribers-id "Link to this endpoint")
------------------------------------------------------------------------------

Update a single private podcast subscriber.

`PATCH /v1/subscribers/:id`

Parameters
----------


|Field                                                  |Type  |Details |Description               |
|-------------------------------------------------------|------|--------|--------------------------|
|          id            Required                       |String|        |Subscriber ID             |
|          subscriber[email]            Required        |String|        |Subscriber's email address|


Response
--------

A single [Subscriber resource](#Subscriber)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/subscribers/709423 -X PATCH \
  -H "x-api-key: your_api_key" \
  -d "subscriber[email]=updated@example.com" \
  -d "fields[subscriber][]=email"
```
`

### Response

````
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "updated@example.com"
    },
    "relationships": {}
  }
}
```
`

Delete a single subscriber by email address[](#delete-v1-subscribers "Link to this endpoint")
---------------------------------------------------------------------------------------------

Remove a single private podcast subscriber and revoke their access to the podcast.

`DELETE /v1/subscribers`

Parameters
----------


|Field                                        |Type  |Details |Description    |
|---------------------------------------------|------|--------|---------------|
|          show_id            Required        |String|        |Show ID or slug|
|          email            Required          |String|        |Email address  |


Response
--------

A single [Subscriber resource](#Subscriber)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/subscribers -X DELETE \
  -H "x-api-key: your_api_key" \
  -d show_id=132543 \
  -d email=carol@example.com
```
`

### Response

````
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "carol@example.com",
      "status": "default",
      "feed_url": "https://subscribers.transistor.fm/797e600524c5ae",
      "created_at": "2020-01-01 00:00:00 UTC",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "last_notified_at": "2020-07-01 00:00:00 UTC",
      "has_downloads": false,
      "subscribe_url": "https://subscribe.transistor.fm/797e600524c5ae"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```
`

Delete a single subscriber by ID[](#delete-v1-subscribers-id "Link to this endpoint")
-------------------------------------------------------------------------------------

Remove a single private podcast subscriber and revoke their access to the podcast.

`DELETE /v1/subscribers/:id`

Parameters
----------


|Field                                   |Type  |Details |Description  |
|----------------------------------------|------|--------|-------------|
|          id            Required        |String|        |Subscriber ID|


Response
--------

A single [Subscriber resource](#Subscriber)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/subscribers/709423 -X DELETE \
  -H "x-api-key: your_api_key"
```
`

### Response

````
$ {
  "data": {
    "id": "709423",
    "type": "subscriber",
    "attributes": {
      "email": "arthur@example.com",
      "status": "default",
      "feed_url": "https://subscribers.transistor.fm/f0dd44b76ef2cb",
      "created_at": "2020-01-01 00:00:00 UTC",
      "updated_at": "2020-06-01 00:00:00 UTC",
      "last_notified_at": "2020-07-01 00:00:00 UTC",
      "has_downloads": false,
      "subscribe_url": "https://subscribe.transistor.fm/f0dd44b76ef2cb"
    },
    "relationships": {
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```
`

### Webhooks[](#webhooks "Link to this section")

Get webhooks[](#get-v1-webhooks "Link to this endpoint")
--------------------------------------------------------

Retrieve a list of webhooks for a show

`GET /v1/webhooks`

Parameters
----------


|Field                                        |Type  |Details |Description    |
|---------------------------------------------|------|--------|---------------|
|          show_id            Required        |String|        |Show ID or slug|


Response
--------

An array of [Webhook resources](#Webhook)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/webhooks -G \
  -H "x-api-key: your_api_key" \
  -d show_id=132543
```
`

### Response

````
$ {
  "data": [
    {
      "id": "104325",
      "type": "webhook",
      "attributes": {
        "event_name": "episode_created",
        "url": "http://example.com/incoming_web_hooks",
        "created_at": null,
        "updated_at": null
      },
      "relationships": {
        "user": {
          "data": {
            "id": "173455",
            "type": "user"
          }
        },
        "show": {
          "data": {
            "id": "132543",
            "type": "show"
          }
        }
      }
    }
  ]
}
```
`

Subscribe to webhook[](#post-v1-webhooks "Link to this endpoint")
-----------------------------------------------------------------

Subscribe to a webhook with the given event name and show.

`POST /v1/webhooks`

Parameters
----------



* Field:           event_name            Required        
  * Type: String
  * Details:             One of                                  
  * Description: Name of webhook event
* Field:           show_id            Required        
  * Type: String
  * Details:         
  * Description: Show ID or slug
* Field:           url            Required        
  * Type: String
  * Details:         
  * Description: Target URL for webhook delivery


Response
--------

A single [Webhook resource](#Webhook)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/webhooks -X POST \
  -H "x-api-key: your_api_key" \
  -d event_name=episode_created \
  -d show_id=1 \
  -d url=http://example.com/incoming_web_hooks
```
`

### Response

````
$ {
  "data": {
    "id": "104325",
    "type": "webhook",
    "attributes": {
      "event_name": "episode_created",
      "url": "http://example.com/incoming_web_hooks",
      "created_at": null,
      "updated_at": null
    },
    "relationships": {
      "user": {
        "data": {
          "id": "173455",
          "type": "user"
        }
      },
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```
`

Unsubscribe from webhook[](#delete-v1-webhooks-id "Link to this endpoint")
--------------------------------------------------------------------------

Unsubscribe from a webhook.

`DELETE /v1/webhooks/:id`

Parameters
----------


|Field                                   |Type  |Details |Description|
|----------------------------------------|------|--------|-----------|
|          id            Required        |String|        |Webhook ID |


Response
--------

A single [Webhook resource](#Webhook)

Example
-------

### Request

````
$ curl https://api.transistor.fm/v1/webhooks/104325 -X DELETE \
  -H "x-api-key: your_api_key"
```
`

### Response

````
$ {
  "data": {
    "id": "104325",
    "type": "webhook",
    "attributes": {
      "event_name": "episode_created",
      "url": "http://example.com/incoming_web_hooks",
      "created_at": null,
      "updated_at": null
    },
    "relationships": {
      "user": {
        "data": {
          "id": "173455",
          "type": "user"
        }
      },
      "show": {
        "data": {
          "id": "132543",
          "type": "show"
        }
      }
    }
  }
}
```
`

* * *

Resources[](#resources "Link to this section")
----------------------------------------------

API Resources are data objects returned by successful API requests, representing Users, Shows, Episodes, Subscribers, Analytics, and Webhooks.

### User[](#User "Link to this resource")

The current Transistor user account authenticated for the API.

Fields
------


|Name                                                      |Type    |Description             |
|----------------------------------------------------------|--------|------------------------|
|                          created_at                      |Datetime|Timestamp of creation   |
|                          image_url                       |String  |Avatar image URL        |
|                          name                            |String  |Full name               |
|                          time_zone                       |String  |Current time zone       |
|                          updated_at                      |Datetime|Timestamp of last update|


### Show[](#Show "Link to this resource")

An individual Transistor show (podcast).

Fields
------



* Name:                           amazon_music                      
  * Type: String
  * Description: Amazon Music URL
* Name:                           anghami                      
  * Type: String
  * Description: Anghami URL
* Name:                           apple_podcasts                      
  * Type: String
  * Description: Apple Podcasts URL
* Name:                           author                      
  * Type: String
  * Description: Podcast author
* Name:                           castbox                      
  * Type: String
  * Description: Castbox URL
* Name:                           castro                      
  * Type: String
  * Description: Castro URL
* Name:                           category                      
  * Type: String
  * Description: Primary category
* Name:                           copyright                      
  * Type: String
  * Description: Copyright information
* Name:                           created_at                      
  * Type: Datetime
  * Description: Timestamp of creation
* Name:                           deezer                      
  * Type: String
  * Description: Deezer URL
* Name:                           description                      
  * Type: String
  * Description: Podcast description
* Name:                           email_notifications                      
  * Type: Boolean
  * Description: Private podcast email notifications enabled or disabled
* Name:                           explicit                      
  * Type: Boolean
  * Description: Podcast contains explicit content
* Name:                           feed_url                      
  * Type: String
  * Description: Podcast RSS Feed URL
* Name:                           fountain                      
  * Type: String
  * Description: Fountain URL
* Name:                           gaana                      
  * Type: String
  * Description: Gaana URL
* Name:                           goodpods                      
  * Type: String
  * Description: Goodpods URL
* Name:                           iHeartRadio                      
  * Type: String
  * Description: iHeartRadio URL
* Name:                           image_url                      
  * Type: String
  * Description: Podcast artwork image URL
* Name:                           jiosaavn                      
  * Type: String
  * Description: JioSaavn URL
* Name:                           keywords                      
  * Type: String
  * Description: Comma-separated list of keywords
* Name:                           language                      
  * Type: String
  * Description: Podcast's spoken language
* Name:                           multiple_seasons                      
  * Type: Boolean
  * Description: Podcast has multiple seasons
* Name:                           overcast                      
  * Type: String
  * Description: Overcast URL
* Name:                           owner_email                      
  * Type: String
  * Description: Podcast owner email
* Name:                           pandora                      
  * Type: String
  * Description: Pandora URL
* Name:                           player_FM                      
  * Type: String
  * Description: Player FM URL
* Name:                           playlist_limit                      
  * Type: Integer
  * Description: Playlist embed player episode limit
* Name:                           pocket_casts                      
  * Type: String
  * Description: Pocket Casts URL
* Name:                           podcast_addict                      
  * Type: String
  * Description: Podcast Addict URL
* Name:                           private                      
  * Type: Boolean
  * Description: Podcast is private and subscribers are managed by admins
* Name:                           secondary_category                      
  * Type: String
  * Description: Secondary category
* Name:                           show_type                      
  * Type: String
  * Description: Publishing type. Episodic displays newest episodes, serial displays oldest first
* Name:                           slug                      
  * Type: String
  * Description: Podcast slug (used for API and RSS Feed URL)
* Name:                           soundcloud                      
  * Type: String
  * Description: Soundcloud URL
* Name:                           spotify                      
  * Type: String
  * Description: Spotify URL
* Name:                           time_zone                      
  * Type: String
  * Description: Publishing time zone
* Name:                           title                      
  * Type: String
  * Description: Podcast title
* Name:                           tuneIn                      
  * Type: String
  * Description: TuneIn URL
* Name:                           updated_at                      
  * Type: Datetime
  * Description: Timestamp of last update
* Name:                           website                      
  * Type: String
  * Description: Podcast website


Relationships
-------------



* Name:                           episodes                      
  * Type:             An array of            Episode resources          
* Name:                           subscribers                      
  * Type:             An array of            Subscriber resources          


### Episode[](#Episode "Link to this resource")

An individual Transistor podcast episode record.

Fields
------



* Name:                           alternate_url                      
  * Type: String
  * Description: Alternate episode URL overriding the share_url
* Name:                           audio_processing                      
  * Type: Boolean
  * Description: Denotes processing of audio after creating or updating the audio_url
* Name:                           author                      
  * Type: String
  * Description: Episode author
* Name:                           created_at                      
  * Type: Datetime
  * Description: Timestamp of creation
* Name:                           description                      
  * Type: String
  * Description: Longer episode description which may contain HTML and unformatted tags for chapters, people, supporters, etc
* Name:                           duration                      
  * Type: Integer
  * Description: Duration of episode in seconds
* Name:                           duration_in_mmss                      
  * Type: String
  * Description: Duration of episode in minutes and seconds. e.g. 34:12
* Name:                           email_notifications                      
  * Type: String
  * Description: Private podcast email notifications override (defaults to Show setting)
* Name:                           embed_html                      
  * Type: String
  * Description: Embeddable audio player HTML
* Name:                           embed_html_dark                      
  * Type: String
  * Description: Dark theme of the embeddable audio player HTML
* Name:                           explicit                      
  * Type: Boolean
  * Description: Episode contains explicit content
* Name:                           formatted_description                      
  * Type: String
  * Description: HTML episode description including dynamic content like chapters, people, supporters, etc
* Name:                           formatted_published_at                      
  * Type: String
  * Description: Formatted version of the published_at datetime field
* Name:                           formatted_summary                      
  * Type: String
  * Description: Formatted episode summary short description
* Name:                           image_url                      
  * Type: String
  * Description: Episode artwork image URL
* Name:                           keywords                      
  * Type: String
  * Description: Comma-separated list of keywords
* Name:                           media_url                      
  * Type: String
  * Description: Trackable audio MP3 URL
* Name:                           number                      
  * Type: Integer
  * Description: Episode number
* Name:                           published_at                      
  * Type: Datetime
  * Description: Episode publishing date and time - in your podcast's time zone
* Name:                           season                      
  * Type: Integer
  * Description: Season number
* Name:                           share_url                      
  * Type: String
  * Description: Social media sharing page URL
* Name:                           slug                      
  * Type: String
  * Description: Slugified episode title used in Transistor websites. e.g. my-first-episode
* Name:                           status                      
  * Type: String
  * Description: Publishing status: published, scheduled, or draft
* Name:                           summary                      
  * Type: String
  * Description: Episode summary short description
* Name:                           title                      
  * Type: String
  * Description: Episode title
* Name:                           transcript_url                      
  * Type: String
  * Description: Shareable URL for the episode transcript
* Name:                           transcripts                      
  * Type: Array
  * Description: An array of URLs to AI transcription formats
* Name:                           type                      
  * Type: String
  * Description: Full, trailer, or bonus episode
* Name:                           updated_at                      
  * Type: Datetime
  * Description: Timestamp of last update
* Name:                           video_url                      
  * Type: String
  * Description: YouTube video URL to be embedded on episode sharing pages and website pages


Relationships
-------------



* Name:                           show                      
  * Type:             A single            Show resource          


### Subscriber[](#Subscriber "Link to this resource")

An individual subscriber record for a private podcast.

Fields
------



* Name:                           created_at                      
  * Type: Datetime
  * Description: Timestamp of creation
* Name:                           email                      
  * Type: String
  * Description: Subscriber's email address
* Name:                           feed_url                      
  * Type: String
  * Description: URL for subscriber's unique RSS Feed
* Name:                           has_downloads                      
  * Type: Boolean
  * Description: Subscriber has downloaded at least one episode
* Name:                           last_notified_at                      
  * Type: Datetime
  * Description: Timestamp of when subscriber was last emailed
* Name:                           status                      
  * Type: String
  * Description: Email notification status - default, subscribed, or unsubscribed
* Name:                           subscribe_url                      
  * Type: String
  * Description: URL for subscriber's private landing page
* Name:                           updated_at                      
  * Type: Datetime
  * Description: Timestamp of last update


Relationships
-------------



* Name:                           show                      
  * Type:             A single            Show resource          


### ShowAnalytics[](#ShowAnalytics "Link to this resource")

Download analytics per day for a single podcast.

Fields
------



* Name:                           downloads                      
  * Type: Array
  * Description: An array of download counts per day
* Name:                           end_date                      
  * Type: String
  * Description: Ending date of the analytics date range
* Name:                           start_date                      
  * Type: String
  * Description: Starting date of the analytics date range


Relationships
-------------



* Name:                           show                      
  * Type:             A single            Show resource          


### EpisodesAnalytics[](#EpisodesAnalytics "Link to this resource")

Download analytics per day for all episodes of a single podcast.

Fields
------


|Name                                                      |Type  |Description|
|----------------------------------------------------------|------|-----------|
|                          end_date                        |String|           |
|                          episodes                        |Array |           |
|                          start_date                      |String|           |


Relationships
-------------



* Name:                           show                      
  * Type:             A single            Show resource          


### EpisodeAnalytics[](#EpisodeAnalytics "Link to this resource")

Download analytics per day for a single episode.

Fields
------



* Name:                           downloads                      
  * Type: Array
  * Description: An array of download counts per day
* Name:                           end_date                      
  * Type: String
  * Description: Ending date of the analytics date range
* Name:                           start_date                      
  * Type: String
  * Description: Starting date of the analytics date range


Relationships
-------------



* Name:                           episode                      
  * Type:             A single            Episode resource          


### AudioUpload[](#AudioUpload "Link to this resource")

Authorized audio upload resource, including the upload\_url to upload the audio file to, and the content\_type to use when uploading.

Fields
------



* Name:                           audio_url                      
  * Type: String
  * Description: URL of your audio file after uploading is complete. To be used when creating or updating an episode
* Name:                           content_type                      
  * Type: String
  * Description: Content type of the file to upload. audio/mpeg, audio/wav, etc
* Name:                           expires_in                      
  * Type: Integer
  * Description: Amount of time in seconds before the authorized upload URL expires
* Name:                           upload_url                      
  * Type: String
  * Description: Endpoint URL to upload your audio file to using HTTP PUT


### Webhook[](#Webhook "Link to this resource")

An individual subscription to a Transistor webhook. Limited to a maximum of 50 webhooks per user account.

Fields
------


|Name                                                      |Type  |Description                    |
|----------------------------------------------------------|------|-------------------------------|
|                          created_at                      |String|Timestamp of creation          |
|                          event_name                      |String|Name of webhook event          |
|                          updated_at                      |String|Timestamp of last update       |
|                          url                             |String|Target URL for webhook delivery|


Relationships
-------------



* Name:                           user                      
  * Type:             A single            User resource          
* Name:                           show                      
  * Type:             A single            Show resource          


[Back to the top](#intro)