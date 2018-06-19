'use strict';

const mysql = require('mysql2');
const moment = require('moment');
const debug = require('util').debuglog('partitionBuster');
const assert = require('assert');

const PartitionBuster = function () {
  assert.ok(process.env.DB_HOST, 'DB_HOST');
  assert.ok(process.env.DB_USER, 'DB_USER');
//  assert.ok(process.env.DB_PASSWORD, 'DB_PASSWORD');
  assert.ok(process.env.DB_NAME, 'DB_NAME');
  assert.ok(process.env.TABLE_NAME, 'TABLE_NAME');

  this.cutoff = ~~process.env.CUTOFF_DAYS || 7;
  this.table = process.env.TABLE_NAME;
  this.database = process.env.DB_NAME;

  this.connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: ~~process.env.DB_PORT || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
  }); 
};

PartitionBuster.prototype.getPartitions = function (callback) {
  let query = "SELECT GROUP_CONCAT(PARTITION_NAME SEPARATOR ', ') AS partitions";
  query += " FROM information_schema.partitions WHERE TABLE_SCHEMA='";
  query += this.database;
  query += "' AND TABLE_NAME = '";
  query += this.table;
  query += "' AND PARTITION_NAME IS NOT NULL AND PARTITION_NAME != 'max'";
  query += " AND STRCMP(PARTITION_NAME, 'p";
  query += moment().subtract(this.cutoff, 'day').format('YYYYMMDD');
  query += "') < 1;";

  debug(`getPartitions Query: ${query}`);

  this.connection.query(query, (err, res, fields) => {
    if (err) {
      console.error(`getPartitions Query Error: ${err}`);
      process.exit(1);
    }

    this.partitions = res && res[0] && res[0].partitions;

    if (callback) {
      callback(this);
    }
  });
};

PartitionBuster.prototype.dropPartitions = function (that) {
  that = that || this;

  if (!that.partitions) {
    console.error('No partitions to drop');
    process.exit(1);
  }

  let query = 'ALTER TABLE ';
  query += that.database;
  query += '.';
  query += that.table;
  query += ' DROP PARTITION ';
  query += that.partitions;

  debug(`dropPartitions Query: ${query}`);

  that.connection.query(query, (err, res, fields) => {
    if (err) {
      console.error(`dropPartitions Query Error: ${err}`);
      process.exit(1);
    }

    console.log(`${that.partitions.split(', ').length} partitions dropped`);
    process.exit(0);
  });
};

module.exports = PartitionBuster;
