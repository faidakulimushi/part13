CREATE TABLE blogs (
  id SERIAL PRIMARY KEY,
  author TEXT,
  url TEXT NOT NULL,
  title TEXT NOT NULL,
  likes INTEGER DEFAULT 0
);

INSERT INTO blogs (author, url, title, likes)
VALUES ('Faida Kulimushi', 'https://example.com/blog1', 'My First Blog', 5);

INSERT INTO blogs (author, url, title, likes)
VALUES ('John Doe', 'https://example.com/blog2', 'Learning PostgreSQL', 10);