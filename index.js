require('@tensorflow/tfjs-node');
const tf = require('@tensorflow/tfjs');
const loadCSV = require('./load-csv');

function KNN(features, labels, predictionPoint, k){
    return (features
        .sub(predictionPoint)
        .pow(2)
        .sum(1)
        .pow(0.5)
        .expandDims(1)
        .concat(labels, 1)
        .unstack()
        .sort((a,b) => a.get(0) > b.get(0) ? 1 : -1)
        .slice(0, k)
        .reduce((acc, cur) => acc+cur.get(1), 0)/k);

}

let { features, labels, testFeatures, testLabels } = loadCSV('kc_house_data.csv', {
    shuffle: true,
    splitTest: 10,
    dataColumns: ['lat', 'long'],
    labelColumns: ['price']
});

features = tf.tensor(features);
labels = tf.tensor(labels);

const result = KNN(features, labels, tf.tensor(testFeatures[0]), 10);

console.log('Guess', result, testLabels[0][0]);