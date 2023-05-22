package models

import (
	"time"
)

type Notice struct {
	ID         string    `gorm:"type:uuid;default:uuid_generate_v4()" gorm:"column:id"`
	Title      string    `gorm:"column:title"`
	Body       string    `gorm:"column:body"`
	URL        string    `gorm:"column:url"`
	AuthorName string    `gorm:"column:authorName"`
	AuthorURL  string    `gorm:"column:authorUrl"`
	ImageURL   *string   `gorm:"column:imageUrl"`
	CreatedAt  time.Time `gorm:"column:createdAt"`
	UpdatedAt  time.Time `gorm:"column:updatedAt"`
	SourceID   string    `gorm:"column:sourceId"`
	Source     Source    `gorm:"foreignKey:SourceID"`
	Raw        string    `gorm:"column:raw"`
}

func (Notice) TableName() string {
	return "Notice"
}

type Keyword struct {
	ID        string    `gorm:"type:uuid;default:uuid_generate_v4()" gorm:"column:id"`
	Value     string    `gorm:"unique" gorm:"column:value"`
	CreatedAt time.Time `gorm:"column:createdAt"`
	UpdatedAt time.Time `gorm:"column:updatedAt"`
}

func (Keyword) TableName() string {
	return "Keyword"
}

type Source struct {
	ID          string    `gorm:"type:uuid;default:uuid_generate_v4()" gorm:"column:id"`
	Name        string    `gorm:"unique" gorm:"column:name"`
	Description *string   `gorm:"column:description"`
	CreatedAt   time.Time `gorm:"column:createdAt"`
	UpdatedAt   time.Time `gorm:"column:updatedAt"`
}

func (Source) TableName() string {
	return "Source"
}
