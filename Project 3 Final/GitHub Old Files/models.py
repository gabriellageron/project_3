from .app import db
from datetime import datetime


class Stock(db.Model):
    __tablename__ = 'stock'

    id = db.Column(db.Integer, primary_key=True)
    symbol = db.Column(db.String(64))
    date = db.Column(db.DateTime, nullable = False)
    open = db.Column(db.Float)
    high = db.Column(db.Float)
    low = db.Column(db.Float)
    close = db.Column(db.Float)
    volume = db.Column(db.Integer)

    def __repr__(self):
        return '<Stock %r>' % (self.name)

class Ticker(db.Model):
    __tablename__ = 'stockticker'

    symbol = db.Column(db.String(64), primary_key=True)

    def __repr__(self):
        return '<Ticker %r>' % (self.name)