package main

import (
	"encoding/json"
	"github.com/google/uuid"
	"github.com/justinemmanuelmercado/go-scraper/pkg/feed"
	"github.com/justinemmanuelmercado/go-scraper/pkg/models"
	"github.com/justinemmanuelmercado/go-scraper/pkg/store"
	"log"
	"time"
)

const dsn = "user=postgres password=postgres dbname=phdev host=localhost port=5432 sslmode=disable TimeZone=Asia/Shanghai"

func main() {
	db := store.OpenDB(dsn)

	items, err := feed.FetchWwr()
	if err != nil {
		log.Fatalf("error getting feed: ")
	}

	for _, item := range items {
		jsonData, err := json.Marshal(item)
		if err != nil {
			log.Fatalf("error saving feed: ")
		}
		id, err := uuid.NewRandom()
		if err != nil {
			log.Fatalf("error generating uuid: %v")
		}
		notice := models.Notice{
			ID:        id.String(),
			Title:     item.Title,
			Body:      item.Description,
			URL:       item.Link,
			CreatedAt: time.Time{},
			UpdatedAt: time.Time{},
			SourceID:  feed.WwrSourceId,
			Source:    feed.WwrSource,
			Raw:       string(jsonData),
		}

		if item.Author != nil {
			notice.AuthorName = item.Author.Name
			notice.AuthorURL = item.Author.Email
		}

		if item.Image != nil {
			notice.ImageURL = &item.Image.URL
		}

		db.Create(&notice)
	}
}
