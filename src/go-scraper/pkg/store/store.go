package store

import (
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"log"
)

func OpenDB(dsn string) *gorm.DB {
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatalf("Error connecting to the database: %v", err)
	}

	return db
}
