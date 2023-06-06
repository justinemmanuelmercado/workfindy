package rss_feed

import (
	"encoding/json"
	"fmt"
	"github.com/google/uuid"
	"github.com/justinemmanuelmercado/go-scraper/pkg/models"
	"github.com/justinemmanuelmercado/go-scraper/pkg/store"
	"github.com/mmcdole/gofeed"
)

type RssFeed struct {
	url        string
	sourceName string
}

func (rf *RssFeed) FetchItems() ([]*gofeed.Item, error) {
	fp := gofeed.NewParser()

	feed, err := fp.ParseURL(rf.url)
	if err != nil {
		return nil, err
	}

	return feed.Items, nil
}

func NoticesFromFeedItems(items []*gofeed.Item, sourceId string) []*models.Notice {
	notices := make([]*models.Notice, len(items))

	for i, item := range items {
		jsonData, err := json.Marshal(item)
		if err != nil {
			jsonData = []byte{}
		}

		newNotice := &models.Notice{
			ID:       uuid.New().String(),
			Title:    item.Title,
			Body:     item.Description,
			URL:      item.Link,
			SourceID: sourceId,
			Raw:      string(jsonData),
			Guid:     item.GUID,
		}

		if item.Image != nil {
			newNotice.ImageURL = &item.Image.URL
		}

		if len(item.Authors) > 0 {
			newNotice.AuthorName = item.Authors[0].Name
			newNotice.AuthorURL = item.Authors[0].Email
		}

		notices[i] = newNotice
	}

	return notices
}

func GetAllNotices(source *store.Source) ([]*models.Notice, error) {
	handleFeed := func(feedFunc func() *RssFeed) ([]*models.Notice, error) {
		feed := feedFunc()
		items, err := feed.FetchItems()
		if err != nil {
			return nil, fmt.Errorf("failed to fetch %s: %w", feed.sourceName, err)
		}

		sourceItem, err := source.GetSourceByName(feed.sourceName)
		if err != nil {
			return nil, fmt.Errorf("failed to fetch %s source id: %w", feed.sourceName, err)
		}
		return NoticesFromFeedItems(items, sourceItem.ID), nil
	}

	wwrNotices, err := handleFeed(GetWwrFeed)
	if err != nil {
		return nil, err
	}

	remotiveNotices, err := handleFeed(GetRemotiveFeed)
	if err != nil {
		return nil, err
	}

	return append(remotiveNotices, wwrNotices...), nil
}
