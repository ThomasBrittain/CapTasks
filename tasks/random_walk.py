import asyncio
import datetime
import pathlib
import random

import pandas as pd


class RandomWalk:

    step_size = 0.01
    lower_start = 20.0
    upper_start = 80.0
    wait_time = 1.0
    db_name = './RandomWalkDB'
    db = None

    @classmethod
    async def start(cls):

        cls.value = round(random.Random().uniform(cls.lower_start, cls.upper_start), 2)

        # Write the initial value as there is not yet any data
        if not cls.db:
            await cls.write_value()

        while True:

            await asyncio.sleep(cls.wait_time)

            increment_scalar = 1.0 if random.Random().uniform(0, 1) < 0.5 else -1.0

            increment = increment_scalar * cls.step_size

            cls.value = round(cls.value + increment, 2)

            await cls.write_value()

    @classmethod
    async def write_value(cls):

        current_time = datetime.datetime.now()

        new_entry = pd.DataFrame({'DateTime': current_time, 'Value': cls.value}, index=[0])

        if cls.db is None or cls.db.empty:
            cls.db = new_entry

        else:
            cls.db = pd.concat([cls.db, new_entry])

        cls.db.to_pickle(cls.db_name)

        print(f'Time: {current_time}, Value: {cls.value}')

        return

    @classmethod
    def get_db_path(cls):

        db_path = pathlib.Path().resolve()

        db_path = [x for x in str(db_path).split('/') if x != '']

        while db_path[-1] != 'CapTasks':
            db_path.pop()

        db_path.append('tasks/RandomWalkDB')

        db_path = '/' + '/'.join(db_path)

        return db_path

    @classmethod
    async def get_time_and_value(cls):

        db_path = cls.get_db_path()

        cls.db = None

        while cls.db is None or cls.db.empty:
            await asyncio.sleep(0.25)
            cls.db = pd.read_pickle(db_path)

        last_time, last_value = cls.db.tail(1)['DateTime'].item().to_pydatetime(), cls.db.tail(1)['Value'].item()

        return last_time, last_value

    @classmethod
    async def get_chart_data(cls, as_json=True, format_datetime=True):

        db_path = cls.get_db_path()

        cls.db = None

        while cls.db is None or cls.db.empty:
            await asyncio.sleep(0.25)
            cls.db = pd.read_pickle(db_path)

        cls.db['Timestamp'] = cls.db['DateTime'].apply(lambda x: x.timestamp())

        if format_datetime:
            cls.db['DateTime'] = cls.db['DateTime'].apply(lambda x: x.strftime("%H:%M:%S"))

        if as_json:
            return cls.db.to_json(orient='records')

        return cls.db


if __name__ == '__main__':

    asyncio.run(RandomWalk.start())
