package feed

import (
	"github.com/justinemmanuelmercado/go-scraper/pkg/models"
	"time"
)

const WwrRssFeedUrl = "https://weworkremotely.com/categories/remote-programming-jobs.rss"

func FetchWwr() ([]Item, error) {
	feed, err := FetchFeed(WwrRssFeedUrl)
	if err != nil {
		return nil, err
	}

	return feed, nil
}

var WwrSourceId = "b04f5101-1832-4dba-99e8-485b19b26a26"
var name = "Reddit - Test"
var createdAt, _ = time.Parse("2006-01-02 15:04:05.999", "2023-04-07 07:15:48.826")
var updatedAt, _ = time.Parse("2006-01-02 15:04:05.999", "2023-04-07 07:15:48.826")

var WwrSource = models.Source{
	ID:          WwrSourceId,
	Name:        name,
	Description: nil,
	CreatedAt:   createdAt,
	UpdatedAt:   updatedAt,
}
