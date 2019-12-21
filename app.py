# import necessary libraries
import os
from flask import (
    Flask,
    render_template,
    jsonify,
    request,
    redirect)
import json
import requests
import time

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Maps Setup
#################################################
mapkey = os.environ.get('MAPKEY', '') or "CREATE MAPKEY ENV"
alphakey = os.environ.get('ALPHAKEY', '') or "CREATE ALPHAKEY ENV"

#################################################
# Database Setup
#################################################

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or "postgres://postgres:postgres@localhost:5432/stockdb"


# app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '')
db = SQLAlchemy(app)

from .models import (Stock, Ticker)

#db.create_all()

@app.route("/")
def home():
    return "Hello with create"

#https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&outputsize=full&symbol=LUNA&apikey=demo
@app.route("/query")
def query():
    global alphakey
    
    #?function=TIME_SERIES_DAILY&outputsize=full&symbol=LUNA&apikey=demo
    function = request.args.get('function')
    outputsize = request.args.get('outputsize')
    # symbols = request.args.get('symbol').split(",")
    apikey = alphakey

    results = db.session.query(Ticker.symbol).all()
    tickerList = [result[0] for result in results]

    for symbol in tickerList:

        url = f"https://www.alphavantage.co/query?function={function}&outputsize={outputsize}&symbol={symbol}&apikey={apikey}"

        #requests.get(..)
        #json.loads(..)
        r = requests.get(url)
        print(r.json())
        time.sleep(18)
        #json.loads()

        data = r.json()["Time Series (Daily)"]
        for entry in data.items():
            date = entry[0]
            openData = entry[1]["1. open"]
            high = entry[1]["2. high"]
            low = entry[1]["3. low"]
            closeData = entry[1]["4. close"]
            volume = entry[1]["5. volume"]
            point = Stock(symbol=symbol, date=date, open= openData, high=high, low=low, close=closeData, volume=volume)
            db.session.add(point)
            db.session.commit()
        #   = Pet(name=name, lat=lat, lon=lon)
        # db.session.add(pet)
        # db.session.commit()
    return data

if __name__ == "__main__":
    app.run()