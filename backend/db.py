import mysql.connector
from mysql.connector import errorcode
from datetime import datetime

# Database configuration
config = {
    'user': 'new_user',
    'password': 'new_password',
    'host': 'localhost',
    'raise_on_warnings': True
}

# Add the database name to the configuration
initialized_config = {**config, 'database': 'evil_twitter_db'}

def initialize_database():
    """Initialize the database by executing the schema.sql file."""
    
    # Read the schema.sql file
    with open('schema.sql', 'r') as file:
        schema = file.read()

    # Split the schema into individual SQL statements
    statements = schema.split(';')

    cnx = None
    cursor = None

    try:
        # Connect to the MySQL server
        cnx = mysql.connector.connect(**config)
        cursor = cnx.cursor()

        # Explicitly set the database to use
        cursor.execute("USE evil_twitter_db;")

        # Execute each statement individually
        for statement in statements:
            statement = statement.strip()
            if statement:  # Skip empty statements
                cursor.execute(statement)
                print(f"Executed: {statement}")

        print("Database initialized successfully.")

    except mysql.connector.Error as err:
        print(f"Something went wrong with database initialization: {err}")
    finally:
        if cursor:
            cursor.close()
        if cnx:
            cnx.close()

def add_post(author, content):
    """Add a new post to the database."""
    try:
        print("Trying to add post by", author, "with content:", content)
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor()
        query = ("INSERT INTO posts (author, content) "
                 "VALUES (%s, %s)")
        data = (author, content)
        cursor.execute(query, data)
        cnx.commit()
        print("Post added successfully.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        cnx.close()

def delete_post(post_id):
    """Delete a post from the database by ID."""
    try:
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor()
        query = "DELETE FROM posts WHERE id = %s"
        cursor.execute(query, (post_id,))
        cnx.commit()
        print("Post deleted successfully.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        cnx.close()

def edit_post(post_id, new_content):
    """Edit the content of a post by ID."""
    try:
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor()
        query = "UPDATE posts SET content = %s WHERE id = %s"
        cursor.execute(query, (new_content, post_id))
        cnx.commit()
        print("Post updated successfully.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        cnx.close()

def get_posts():
    """Retrieve all posts from the database."""
    try:
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor(dictionary=True)
        query = "SELECT id, author, content, likes, created_at FROM posts"
        cursor.execute(query)
        posts = cursor.fetchall()
        return posts
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return []
    finally:
        cursor.close()
        cnx.close()

def increment_likes(post_id):
    """Increment the likes of a post by ID."""
    try:
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor()
        query = "UPDATE posts SET likes = likes + 1 WHERE id = %s"
        cursor.execute(query, (post_id,))
        cnx.commit()
        print(f"Likes incremented for post ID {post_id}.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        cnx.close()

def add_reply(post_id, author, content):
    """Add a new reply to a specific post."""
    try:
        print(f"Trying to add reply to post ID {post_id} by {author} with content: {content}")
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor()
        query = ("INSERT INTO replies (post_id, author, content) "
                 "VALUES (%s, %s, %s)")
        data = (post_id, author, content)
        cursor.execute(query, data)
        cnx.commit()
        print("Reply added successfully.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        cnx.close()

def get_replies(post_id):
    """Retrieve all replies for a specific post."""
    try:
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor(dictionary=True)
        query = "SELECT id, post_id, author, content, created_at FROM replies WHERE post_id = %s"
        cursor.execute(query, (post_id,))
        replies = cursor.fetchall()
        return replies
    except mysql.connector.Error as err:
        print(f"Error: {err}")
        return []
    finally:
        cursor.close()
        cnx.close()

def delete_reply(reply_id):
    """Delete a reply from the database by ID."""
    try:
        cnx = mysql.connector.connect(**initialized_config)
        cursor = cnx.cursor()
        query = "DELETE FROM replies WHERE id = %s"
        cursor.execute(query, (reply_id,))
        cnx.commit()
        print(f"Reply ID {reply_id} deleted successfully.")
    except mysql.connector.Error as err:
        print(f"Error: {err}")
    finally:
        cursor.close()
        cnx.close()