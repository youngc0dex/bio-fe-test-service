const Tour = require('./../models/tourModel');
const APIFeatures = require('./../utils/apiFeatures');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-rating';
  req.query.fields = 'name,description,rating';
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    const { search, limit } = req.query;
    const query = {};

    if (search) {
      query.name = new RegExp(search, 'i');
    }

    const tours = await Tour.find(query)
      .sort({ createdAt: -1 })
      // eslint-disable-next-line radix
      .limit(parseInt(limit));

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: tours
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    const tour = await Tour.findById(req.params.id);
    // Tour.findOne({ _id: req.params.id })

    res.status(200).json({
      status: 'success',
      data: tour
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getNewTour = async (req, res) => {
  try {
    const tours = Tour.find();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: tours.length,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);

    res.status(201).json({
      status: 'Sukses Terbuat!',
      data: newTour
    });
  } catch (err) {
    res.status(400).json({
      status: 'Gagal',
      message: 'Tujuan baru gagal terbuat'
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getTourStats = async (req, res) => {
  try {
    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 4.5 } }
      },
      {
        $group: {
          _id: { $toUpper: '$difficulty' },
          numTours: { $sum: 1 },
          numRatings: { $sum: '$ratingsQuantity' },
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },
      {
        $sort: { avgPrice: 1 }
      }
      // {
      //   $match: { _id: { $ne: 'EASY' } }
      // }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        stats
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getMonthlyPlan = async (req, res) => {
  try {
    const year = req.params.year * 1; // 2021

    const plan = await Tour.aggregate([
      {
        $unwind: '$startDates'
      },
      {
        $match: {
          startDates: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`)
          }
        }
      },
      {
        $group: {
          _id: { $month: '$startDates' },
          numTourStarts: { $sum: 1 },
          tours: { $push: '$name' }
        }
      },
      {
        $addFields: { month: '$_id' }
      },
      {
        $project: {
          _id: 0
        }
      },
      {
        $sort: { numTourStarts: -1 }
      },
      {
        $limit: 12
      }
    ]);

    res.status(200).json({
      status: 'success',
      data: {
        plan
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.getNewlyAddedTour = async (req, res) => {
  try {
    const tour = await Tour.find().sort({ createdAt: -1 });
    if (tour && tour.length > 0) {
      return res.status(200).json({
        status: 'success',
        data: tour[0]
      });
    }
    throw new Error();
  } catch (e) {
    res.status(500).json({
      status: 'Gagal',
      message: 'Data tidak ditemukan atau sintaks penggunaan salah'
    });
  }
};

exports.getTopFiveTour = async (req, res) => {
  try {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;
    return res.status(200).json({
      status: 'success',
      data: tours
    });
  } catch (e) {
    res.status(500).json({
      status: 'Gagal',
      message: 'Data tidak ditemukan atau sintaks penggunaan salah'
    });
  }
};
