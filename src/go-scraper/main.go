package main

import (
	"github.com/joho/godotenv"
	"github.com/justinemmanuelmercado/go-scraper/pkg/rss_feed"
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

	sourceStore := store.InitSource(db)

	newNotices, err := rss_feed.GetAllNotices(sourceStore)
	if err != nil {
		log.Fatalf("Error getting Notices from RSS feeds: %v\n", err)
	}

	noticeStore := store.InitNotice(db)

	err = noticeStore.CreateNotices(newNotices)
	if err != nil {
		log.Fatalf("Error creating notices: %v\n", err)
	}

}
