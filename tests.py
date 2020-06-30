"""Tests for NookCookBook Flask app."""

import unittest
import server
import model

class ServerTests(unittest.TestCase):
    """Tests for NookCookBook site."""

    def setUp(self):
        """Code to run before every test."""

        self.client = server.app.test_client()
        server.app.config['TESTING'] = True

        model.connect_to_db(server.app)

    def tearDown(self):
        model.db.session.close()

    def test_homepage(self):
        result = self.client.get('/')
        self.assertIn(b'<div id="root">', result.data)

    def test_category_filter(self):
        result = self.client.get('/api/filter_recipes?category=bag&series=&keywords=')
        self.assertIn(b'"name":"Acorn Pochette","recipe_id":1},', result.data)
        self.assertIn(b'"name":"Basket Pack","recipe_id":45},', result.data)
        self.assertIn(b'"name":"Bunny Day Bag","recipe_id":64},', result.data)
        self.assertIn(b'"name":"Cherry-Blossom Pochette","recipe_id":103},', result.data)
        self.assertIn(b'"name":"Knitted-Grass Backpack","recipe_id":289},', result.data)
        self.assertIn(b'"name":"Log Pack","recipe_id":315},', result.data)
        self.assertIn(b'"name":"Maple-Leaf Pochette","recipe_id":328},', result.data)
        self.assertIn(b'"name":"Shellfish Pochette","recipe_id":450},', result.data)
        self.assertIn(b'"name":"Snowflake Pochette","recipe_id":467},', result.data)
        self.assertIn(b'"name":"Star Pochette","recipe_id":480}]\n', result.data)

    def test_series_filter(self):
        result = self.client.get('/api/filter_recipes?category=&series=coco&keywords=')
        self.assertIn(b'"name":"Coconut Juice","recipe_id":119},', result.data)
        self.assertIn(b'"name":"Coconut Wall Planter","recipe_id":120},', result.data)
        self.assertIn(b'"name":"Palm-Tree Lamp","recipe_id":376}]\n', result.data)

    def test_keywords_filter(self):
        result = self.client.get('/api/filter_recipes?category=&series=&keywords=pochette')
        self.assertIn(b'"name":"Acorn Pochette","recipe_id":1},', result.data)
        self.assertIn(b'"name":"Cherry-Blossom Pochette","recipe_id":103},', result.data)
        self.assertIn(b'"name":"Maple-Leaf Pochette","recipe_id":328},', result.data)
        self.assertIn(b'"name":"Shellfish Pochette","recipe_id":450},', result.data)
        self.assertIn(b'"name":"Snowflake Pochette","recipe_id":467},', result.data)
        self.assertIn(b'"name":"Star Pochette","recipe_id":480}]\n', result.data)


if __name__ == '__main__':
    unittest.main()