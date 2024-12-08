import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const API_URL = process.env.API_URL as string;

const DEFAULT_LIMIT = 10;
const DEFAULT_OFFSET = 0;

class TripController {
    // Mendapatkan data semua perjalanan taksi
    static async getTrips(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = req.query;
            const response = await axios.get(`${API_URL}?$limit=${limit}&$offset=${offset}&$order=pickup_datetime`);
            if (response.data.length === 0) throw { name: "trip_not_found" };
            res.status(200).json(response.data);
        } catch (error) {
            next(error);
        }
    }

    // Mendapatkan data perjalanan taksi dengan filter
    static async getTripsByFilter(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            // Validasi query parameter
            TripController.validateQuery(req.query);
            // Membangun filter query
            const filterQuery = TripController.buildFilterQuery(req.query);
            const { limit = DEFAULT_LIMIT, offset = DEFAULT_OFFSET } = req.query;

            const response = await axios.get(`${API_URL}${filterQuery}&$limit=${limit}&$offset=${offset}&$order=pickup_datetime`);
            if (response.data.length === 0) throw { name: "trip_not_found" };

            res.status(200).json(response.data);
        } catch (error) {
            next(error);
        }
    }

    // Validasi query parameter
    static validateQuery(query: any): void {
        const {
            pickup_datetime,
            dropoff_datetime,
            min_fare,
            max_fare,
            min_distance,
            max_distance,
            payment_type,
        } = query;

        // Periksa apakah tidak ada input sama sekali
        if (!pickup_datetime && !dropoff_datetime && !min_fare && !max_fare && !min_distance && !max_distance && !payment_type) {
            throw { name: "validation_input" };
        }

        // Validasi numerik
        TripController.validateNumericFields({ min_fare, max_fare, min_distance, max_distance });

        // Validasi tanggal
        TripController.validateDateFields({ pickup_datetime, dropoff_datetime });

        // Validasi tipe pembayaran
        TripController.validatePaymentType(payment_type);
    }

    // Validasi field numerik
    static validateNumericFields(fields: { [key: string]: any }): void {
        for (const [key, value] of Object.entries(fields)) {
            if (value && isNaN(value)) throw { name: `validation_${key}` };
        }
    }

    // Validasi field tanggal
    static validateDateFields({ pickup_datetime, dropoff_datetime }: { pickup_datetime?: string; dropoff_datetime?: string }): void {
        if (pickup_datetime && isNaN(Date.parse(pickup_datetime))) throw { name: "validation_pickup_datetime" };
        if (dropoff_datetime && isNaN(Date.parse(dropoff_datetime))) throw { name: "validation_dropoff_datetime" };
    }

    // Validasi tipe pembayaran
    static validatePaymentType(payment_type?: string): void {
        const validPaymentTypes = ["CSH", "CRD", "NOC", "DIS", "UNK"];
        if (payment_type && !validPaymentTypes.includes(payment_type)) throw { name: "validation_payment_type" };
    }

    // Membangun filter query berdasarkan parameter yang diterima
    static buildFilterQuery(query: any): string {
        const { pickup_datetime, dropoff_datetime, min_fare, max_fare, min_distance, max_distance, payment_type } = query;
        let filters: string[] = [];

        if (pickup_datetime) filters.push(`pickup_datetime='${pickup_datetime}'`);
        if (dropoff_datetime) filters.push(`dropoff_datetime='${dropoff_datetime}'`);
        if (min_fare) filters.push(`fare_amount>=${min_fare}`);
        if (max_fare) filters.push(`fare_amount<=${max_fare}`);
        if (min_distance) filters.push(`trip_distance>=${min_distance}`);
        if (max_distance) filters.push(`trip_distance<=${max_distance}`);
        if (payment_type) filters.push(`payment_type='${payment_type}'`);

        return filters.length ? `?$where=${filters.join(' AND ')}` : '';
    }
}

export default TripController;