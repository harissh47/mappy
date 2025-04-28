from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from sklearn.mixture import GaussianMixture

# App configuration (previously from .env)
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls'}
DEBUG = True
PORT = 5000
HOST = "0.0.0.0"

app = Flask(__name__)
CORS(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def validate_data(data):
    required_columns = {'latitude', 'longitude'}
    data.columns = map(str.lower, data.columns)
    
    # Check for required coordinate columns
    if not required_columns.issubset(set(data.columns)):
        missing = required_columns - set(data.columns)
        raise ValueError(f"Missing required columns: {', '.join(missing)}")
    
    # Check for beatcode column with different possible names
    beatcode_variants = {'beatcode', 'beat code'}
    if not any(col in data.columns for col in beatcode_variants):
        raise ValueError("Missing required column: beatcode (or 'beat code')")

def get_beatcode_column(data):
    """Find the beatcode column name case-insensitively"""
    beatcode_variants = {'beatcode', 'beat code'}
    for col in data.columns:
        if col.lower() in beatcode_variants:
            return col
    return None

def perform_clustering(data, min_points=None, max_points=None):
    validate_data(data)
    
    # Get the actual beatcode column name
    beatcode_col = get_beatcode_column(data)
    
    # Convert beatcodes to lowercase for consistent counting
    data[beatcode_col] = data[beatcode_col].astype(str).str.lower()
    
    n_clusters = data[beatcode_col].nunique()
    total_points = len(data)

    if min_points and max_points:
        if min_points <= 0 or max_points <= 0:
            raise ValueError("min_points and max_points must be positive integers")
        n_clusters = max(min(total_points // max_points, n_clusters), total_points // min_points)

    gmm = GaussianMixture(n_components=n_clusters, random_state=42)
    gmm.fit(data[['latitude', 'longitude']])
    data['cluster'] = gmm.predict(data[['latitude', 'longitude']])
    return data.to_dict(orient='records')

@app.route('/cluster', methods=['POST'])
def cluster():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in request"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No file selected"}), 400

        if not allowed_file(file.filename):
            return jsonify({"error": "Unsupported file format. Only CSV and Excel allowed"}), 400

        if file.filename.endswith('.csv'):
            data = pd.read_csv(file)
        else:
            data = pd.read_excel(file)

        min_points = request.form.get('min_points', type=int)
        max_points = request.form.get('max_points', type=int)

        json_data = perform_clustering(data, min_points, max_points)
        return jsonify(json_data)

    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400
    except Exception as e:
        return jsonify({"error": f"Internal Server Error: {str(e)}"}), 500

if __name__ == "__main__":
    app.run(debug=DEBUG, host=HOST, port=PORT)
