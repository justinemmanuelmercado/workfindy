package feed

import (
	"github.com/mmcdole/gofeed"
)

type Item struct {
	Title       string
	Description string
	Link        string
	Guid        string
	Author      *gofeed.Person
	Image       *gofeed.Image
}

func FetchFeed(url string) ([]Item, error) {
	fp := gofeed.NewParser()

	feed, err := fp.ParseURL(url)
	if err != nil {
		return nil, err
	}

	items := make([]Item, len(feed.Items))
	for i, item := range feed.Items {
		newItem := Item{
			Title:       item.Title,
			Link:        item.Link,
			Description: item.Description,
			Image:       item.Image,
			Guid:        item.GUID,
		}

		if len(item.Authors) > 0 {
			newItem.Author = item.Authors[0]
		}

		items[i] = newItem
	}

	return items, nil
}
