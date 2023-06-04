package feed

const WwrRssFeedUrl = "https://weworkremotely.com/categories/remote-programming-jobs.rss"

func FetchWwr() ([]Item, error) {
	feed, err := FetchFeed(WwrRssFeedUrl)
	if err != nil {
		return nil, err
	}

	return feed, nil
}

var WwrSourceId = "b04f5101-1832-4dba-99e8-485b19b26a26"
