import _ from 'lodash';
import GMM from 'gaussian-mixture';

export function performClustering(data) {
  // Validate coordinate columns
  const latitudeCol = _.findKey(_.first(data), (v, k) => k.toLowerCase() === 'latitude');
  const longitudeCol = _.findKey(_.first(data), (v, k) => k.toLowerCase() === 'longitude');
  if (!latitudeCol || !longitudeCol) {
    throw new Error('Missing required latitude/longitude columns');
  }

  // Prepare data points first
  const points = data.map(item => {
    const lat = parseFloat(item[latitudeCol]);
    const lng = parseFloat(item[longitudeCol]);
    if (isNaN(lat) || isNaN(lng)) {
      throw new Error('Invalid coordinates found');
    }
    return [lat, lng];
  });

  // Find beatcode column case-insensitively
  const beatCodeCol = _.findKey(_.first(data), (v, k) => k.toLowerCase() === 'beatcode' || k.toLowerCase() === 'beat code');
  
  // Calculate cluster count safely
  const beatCodes = beatCodeCol 
    ? [...new Set(data.map(item => (item[beatCodeCol] || '').toString().toLowerCase()))]
    : [];
  let nClusters = Math.min(beatCodes.length || 1, points.length);
  nClusters = Math.max(nClusters, 1);

  // Handle single cluster immediately
  if (nClusters === 1) {
    return data.map(item => ({ ...item, cluster: 0 }));
  }

  // Initialize GMM with proper configuration
  const gmm = new GMM({
    nClusters: nClusters,
    covarianceType: 'full',
    initParams: 'random',
    randomSeed: 42,
    maxIterations: 100,
    tolerance: 1e-6
  });

  // Initialize means and fit model
  gmm.means = gmm.kmeansPlusPlusInit(points);
  gmm.fit(points);
  const clusters = gmm.predict(points);

  return data.map((item, index) => ({
    ...item,
    cluster: clusters[index]
  }));
}