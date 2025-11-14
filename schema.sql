CREATE DATABASE IF NOT EXISTS skill_assessment_portal;
USE skill_assessment_portal;

CREATE TABLE IF NOT EXISTS users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS skill_categories (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS questions (
  id INT PRIMARY KEY AUTO_INCREMENT,
  skill_id INT NOT NULL,
  question_text TEXT NOT NULL,
  option_a VARCHAR(255) NOT NULL,
  option_b VARCHAR(255) NOT NULL,
  option_c VARCHAR(255) NOT NULL,
  option_d VARCHAR(255) NOT NULL,
  correct_answer ENUM('A','B','C','D') NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (skill_id) REFERENCES skill_categories(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  skill_id INT NOT NULL,
  total_questions INT NOT NULL,
  score INT NOT NULL,
  started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skill_categories(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS quiz_answers (
  id INT PRIMARY KEY AUTO_INCREMENT,
  attempt_id INT NOT NULL,
  question_id INT NOT NULL,
  selected_answer ENUM('A','B','C','D') NULL,
  is_correct BOOLEAN NOT NULL DEFAULT 0,
  FOREIGN KEY (attempt_id) REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_role ON users(role);
CREATE INDEX idx_question_skill ON questions(skill_id);
CREATE INDEX idx_quiz_attempt_user_skill ON quiz_attempts(user_id, skill_id);
CREATE INDEX idx_quiz_answer_attempt ON quiz_answers(attempt_id);

INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@example.com', '$2b$10$3naRrkcoZoJ0KjBCRfj2KOVfUFdw0BMAqCaelQ2045ivxx36B09/2', 'admin')
ON DUPLICATE KEY UPDATE email=email;
-- Admin password = "admin123"

INSERT INTO users (name, email, password, role)
VALUES ('User', 'user@example.com', '$2b$10$DC0qviO9trEaYY0/9ZUzkO4Hc16Q7rTUMhn25UdKuI0TPVaHtuNjO', 'user')
ON DUPLICATE KEY UPDATE email=email;
-- Admin password = "user123"