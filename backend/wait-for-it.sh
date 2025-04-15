#!/bin/bash
# filepath: c:\Users\pehil\evil-twitter\backend\wait-for-it.sh

set -e

host="$1"
shift
cmd="$@"

until nc -z "$host" 3306; do
  echo "Waiting for MySQL at $host:3306..."
  sleep 1
done

echo "MySQL is up - executing command"
exec $cmd