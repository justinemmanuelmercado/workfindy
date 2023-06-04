package main

import (
	"github.com/joho/godotenv"
	"github.com/justinemmanuelmercado/go-scraper/pkg/store"
	"log"
	"os"
	"path/filepath"
)

func loadEnvFile() {
	root, err := os.Getwd()
	if err != nil {
		log.Fatal(err)
	}

	path := filepath.Join(root, "../..", ".env")
	err = godotenv.Load(path)
}

func main() {
	loadEnvFile()
	dbUrl := os.Getenv("DATABASE_URL")
	db, err := store.OpenDB(dbUrl)
	if err != nil {
		log.Fatalf("Error connecting to database: %v\n", err)
	}

	newStore := store.NewStore(db)

	notice, err := newStore.GetNotice("04ddaadf-8c4b-4371-a085-38ed57cf0468")
	if err != nil {
		log.Fatalf("Error: %v\n", err)
	}

	log.Print(notice)

	//items, err := feed.FetchWwr()
	//if err != nil {
	//	log.Fatalf("error getting feed: ")
	//}
	//
	//for _, item := range items {
	//	jsonData, err := json.Marshal(item)
	//	if err != nil {
	//		log.Fatalf("error saving feed: ")
	//	}
	//	id, err := uuid.NewRandom()
	//	if err != nil {
	//		log.Fatalf("error generating uuid: %v")
	//	}
	//	notice := models.Notice{
	//		ID:        id.String(),
	//		Title:     item.Title,
	//		Body:      item.Description,
	//		URL:       item.Link,
	//		CreatedAt: time.Time{},
	//		UpdatedAt: time.Time{},
	//		SourceID:  feed.WwrSourceId,
	//		Raw:       string(jsonData),
	//	}
	//
	//	if item.Author != nil {
	//		notice.AuthorName = item.Author.Name
	//		notice.AuthorURL = item.Author.Email
	//	}
	//
	//	if item.Image != nil {
	//		notice.ImageURL = &item.Image.URL
	//	}
	//
	//	db.Create(&notice)
	//}
}
