package store

import (
	"context"
	"github.com/jackc/pgx/v5"
	"github.com/justinemmanuelmercado/go-scraper/pkg/models"
	"log"
)

type Store struct {
	conn *pgx.Conn
}

func NewStore(conn *pgx.Conn) *Store {
	return &Store{conn: conn}
}

func OpenDB(connString string) (*pgx.Conn, error) {
	conn, err := pgx.Connect(context.Background(), connString)

	if err != nil {
		return nil, err
	}

	return conn, nil
}

func CloseDB(conn *pgx.Conn) {
	if err := conn.Close(context.Background()); err != nil {
		log.Printf("Failed to close connection %v\n", err)
	}
}

func (s *Store) CreateNotice(notice models.Notice) error {
	query := `
	INSERT INTO "Notice" (id, title, body, url, authorName, authorUrl, imageUrl, createdAt, updatedAt, sourceId, raw, authorName, authorUrl, imageUrl)
	VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`

	_, err := s.conn.Exec(context.Background(), query, notice.ID)
	if err != nil {
		return err
	}
	return nil
}

func (s *Store) GetNotice(id string) (*models.Notice, error) {
	var notice models.Notice
	err := s.conn.QueryRow(context.Background(), `SELECT * FROM "Notice" WHERE id=$1`, id).Scan(
		&notice.ID,
		&notice.Title,
		&notice.Body,
		&notice.URL,
		&notice.AuthorName,
		&notice.AuthorURL,
		&notice.ImageURL,
		&notice.CreatedAt,
		&notice.UpdatedAt,
		&notice.SourceID,
		&notice.Raw,
		&notice.Guid,
	)

	if err != nil {
		return nil, err
	}

	return &notice, nil
}
