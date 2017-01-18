-- CAR
# Find all movie-names that have the word "Car" as the first word in the name

SELECT *
FROM movies
WHERE name LIKE 'Car %';

-- BIRTH YEAR
# Find all movies made in the year you were born

SELECT name
FROM movies
WHERE year = 1990;

-- 1982
# How many movies does our dataset have for the year 1982?

SELECT COUNT(*)
FROM movies
WHERE year = 1982;

-- STACKERSONS
# Find actors who have "stack" in their last name

SELECT first_name, last_name
FROM actors
WHERE last_name LIKE '%stack%';

-- POPULAR NAMES
# What are the 10 most popular first names and last names in the business? And how many actors have each given first or last name? This can be multiple queries.

SELECT first_name, COUNT(*) AS total
FROM actors
GROUP BY first_name
ORDER BY total DESC
LIMIT 10;

SELECT last_name, COUNT(*) AS total
FROM actors
GROUP BY last_name
ORDER BY total DESC
LIMIT 10;

-- -- RANDOM TANGENT
-- SELECT first_name, last_name, COUNT(*) AS total
-- FROM actors
-- GROUP BY first_name, last_name
-- ORDER BY total DESC
-- LIMIT 10;

-- PROLIFIC
# List the top 100 most active actors and the number of ROLES they have starred in

SELECT first_name, last_name, COUNT(*) total_roles
FROM actors
INNER JOIN roles ON actors.id = roles.actor_id
GROUP BY actors.id
ORDER BY total_roles DESC
LIMIT 100;

SELECT first_name, last_name, total_roles
FROM actors
INNER JOIN (
  SELECT actor_id, COUNT(*) AS total_roles
  FROM roles
  GROUP BY actor_id
  ORDER BY total_roles DESC
  LIMIT 100
)
ON id = actor_id;

-- BOTTOM OF THE BARREL
# How many movies does IMDB have of each genre, ordered by least popular genre?

SELECT genre, COUNT(*) as total_genre
FROM movies_genres
GROUP BY genre
ORDER BY total_genre ASC;

-- BRAVEHEART
# List the first and last names of all the actors who played in the 1995 movie 'Braveheart', arranged alphabetically by last name

SELECT first_name, last_name, role
FROM movies
INNER JOIN roles ON movie_id = movies.id
INNER JOIN actors ON actor_id = actors.id
WHERE year = 1995 AND name = 'Braveheart'
ORDER BY last_name ASC;

SELECT first_name, last_name, role
FROM movies, roles, actors
WHERE
  year = 1995 AND
  name = 'Braveheart' AND
  movie_id = movies.id AND
  actor_id = actors.id
ORDER BY last_name ASC;

-- LEAP NOIR
# List all the directors who directed a 'Film-Noir' movie in a leap year (you need to check that the genre is 'Film-Noir' and may, for the sake of this challenge, pretend that all years divisible by 4 are leap years). Your query should return director name, the movie name, and the year, sorted by movie name.

SELECT first_name, last_name, name, year
FROM movies_directors
INNER JOIN movies_genres
ON movies_directors.movie_id = movies_genres.movie_id
INNER JOIN movies
ON movies.id = movies_directors.movie_id
INNER JOIN directors
ON directors.id = movies_directors.director_id
WHERE year % 4 = 0
AND genre = 'Film-Noir'
ORDER BY name ASC;

SELECT first_name, last_name, name, year
FROM movies_directors, movies_genres, movies, directors
WHERE
  movies_directors.movie_id = movies_genres.movie_id AND
  movies.id = movies_directors.movie_id AND
  directors.id = movies_directors.director_id AND
  year % 4 = 0 AND
  genre = 'Film-Noir'
ORDER BY name ASC;

-- ° BACON
# List all the actors that have worked with Kevin Bacon in Drama movies (include the movie name)

SELECT first_name || " " || last_name AS full_name, name
FROM actors, roles, movies, movies_genres
WHERE
  genre = 'Drama' AND
  actors.id = roles.actor_id AND
  movies.id = roles.movie_id AND
  movies.id = movies_genres.movie_id AND
  full_name <> 'Kevin Bacon'
AND movies.id IN (
  SELECT movie_id
  FROM roles, actors
  WHERE first_name = 'Kevin' AND last_name = 'Bacon' AND actor_id = id
)
ORDER BY name ASC
LIMIT 100;

SELECT costars.first_name || " " || costars.last_name AS full_name, name
FROM actors AS KB, roles AS KBroles, movies_genres, actors AS costars, roles AS costarRoles, movies
WHERE
  KB.first_name = 'Kevin' AND KB.last_name = 'Bacon' AND
  genre = 'Drama' AND
  KB.id = KBroles.actor_id AND
  movies_genres.movie_id = KBroles.movie_id AND
  costars.id = costarRoles.actor_id AND
  movies.id = costarRoles.movie_id AND
  KBroles.movie_id = movies.id AND
  full_name <> 'Kevin Bacon'
ORDER BY movies.name ASC
LIMIT 100;

-- IMMORTALS
# Which actors have acted in a film before 1900 and also in a film after 2000?

# slow
SELECT actors.first_name, actors.last_name
FROM actors
  INNER JOIN roles ON actors.id = roles.actor_id
  INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year < 1900
INTERSECT
SELECT actors.first_name, actors.last_name
FROM actors
  INNER JOIN roles ON actors.id = roles.actor_id
  INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 2000;
ORDER BY actors.last_name;

# slower
SELECT first_name, last_name
FROM actors
  INNER JOIN roles ON actors.id = roles.actor_id
  INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 2000
  AND roles.actor_id
  IN (
    SELECT roles.actor_id
    FROM roles
      INNER JOIN movies ON roles.movie_id=movies.id
    WHERE movies.year < 1900
  )
GROUP BY actors.id
ORDER BY actors.last_name;

-- BUSY FILMING
# Find actors that played five or more roles in the same movie after the year 1990. Notice that ROLES may have occasional duplicates, but we are not interested in these: we want actors that had five or more distinct roles in the same movie. Write a query that returns the actors' names, the movie name, and the number of distinct roles that they played in that movie (which will be ≥ 5).

SELECT
  actors.first_name,
  actors.last_name,
  movies.name,
  movies.year,
  COUNT (DISTINCT roles.role) AS num_roles -- roles with DIFFERENT role names!
FROM actors
  INNER JOIN roles ON actors.id = roles.actor_id
  INNER JOIN movies ON roles.movie_id = movies.id
WHERE movies.year > 1990
GROUP BY roles.actor_id, roles.movie_id
HAVING num_roles > 4;

-- FEMALE ACTORS ONLY
# For each year, count the number of movies in that year that had only female actors.
# For movies where no one was casted, you can decide whether to consider them female-only.

# includes movies with no actors
SELECT m.year, COUNT(*) femaleOnly
FROM movies m
WHERE not exists (
  SELECT *
  FROM roles r, actors a
  WHERE a.id = r.actor_id
    AND r.movie_id = m.id
    AND a.gender = 'M'
)
GROUP BY m.year;

# includes movies with no actors
SELECT year, COUNT(*)
FROM movies
WHERE id NOT IN (
  SELECT movie_id
  FROM roles r, actors a
  WHERE gender = 'M'
  AND a.id = actor_id
)

# excludes movies with no actors
SELECT m.year, count(*) femaleOnly
FROM movies m
WHERE NOT EXISTS (SELECT *
  FROM roles AS ma, actors AS a
  WHERE a.id = ma.actor_id
    AND ma.movie_id = m.id
    AND a.gender = 'M')
AND EXISTS (SELECT *
  FROM roles AS ma, actors AS a
  WHERE a.id = ma.actor_id
    AND ma.movie_id = m.id
    AND a.gender = 'F')
GROUP BY m.year;
