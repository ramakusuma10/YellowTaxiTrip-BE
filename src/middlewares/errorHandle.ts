import { Request, Response, NextFunction } from 'express';

const errorHandler = (err: { name: string }, req: Request, res: Response, next: NextFunction): void => {
    switch (err.name) {
        case "validation_input":
            res.status(400).json({ msg: "Invalid Input Data" });
            break;
        case "validation_min_fare":
            res.status(400).json({ msg: "Min Fare must be a number" });
            break;
        case "validation_max_fare":
            res.status(400).json({ msg: "Max Fare must be a number" });
            break;
        case "validation_min_distance":
            res.status(400).json({ msg: "Min Distance must be a number" });
            break;
        case "validation_max_distance":
            res.status(400).json({ msg: "Max Distance must be a number" });
            break;
        case "validation_pickup_datetime":
            res.status(400).json({ msg: "Pickup Datetime must be a valid date" });
            break;
        case "validation_dropoff_datetime":
            res.status(400).json({ msg: "Dropoff Datetime must be a valid date" });
            break;
        case "validation_payment_type":
            res.status(400).json({ msg: "Payment Type must be valid" });
            break;
        case "trip_not_found":
            res.status(404).json({ msg: "Trip Not Found" });
            break;
        default:
            res.status(500).json({ msg: "Internal server error" });
            break;
    }
};

export default errorHandler;