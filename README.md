# partition-buster
A light-weight utility for fast dropping MySQL partitions

## Installation
```zsh
git clone git@github.com:akhale3/partition-buster.git
cd partition-buster
npm install
```

## Usage
```zsh
<DB_HOST=localhost> [DB_PORT=3306] <DB_USER=root> <DB_PASSWORD=toor>
<DB_NAME=testing> <TABLE_NAME=foo> [NODE_DEBUG=partitionBuster] [CUTOFF_DAYS=1]
npm run prune
```

## Example
```zsh
DB_HOST=localhost DB_PORT=3306 DB_USER=root DB_PASSWORD=toor DB_NAME=testing
TABLE_NAME=foo NODE_DEBUG=partitionBuster CUTOFF_DAYS=1
npm run prune
```

## Environment Variables
| Environment Variable | Required | Description                                                       | Default Value |
|----------------------|----------|-------------------------------------------------------------------|---------------|
| DB_HOST              | true     | Host address of DB                                                |               |
| DB_PORT              | false    | Host port of DB                                                   | 3306          |
| DB_USER              | true     | DB Username                                                       |               |
| DB_PASSWORD          | true     | DB Password. Cannot be empty.                                     |               |
| DB_NAME              | true     | DB Schema Name                                                    |               |
| TABLE_NAME           | true     | DB Table to prune                                                 |               |
| CUTOFF_DAYS          | false    | Number of days of data from today to keep                         | 7             |
| NODE_DEBUG           | false    | Flag to enable query logging. Set to `partitionBuster` to enable. |               |
