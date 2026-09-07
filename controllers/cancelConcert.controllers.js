const pool = require("../db");

const cancelConcert = async (req, res, next) => {

    const client = await pool.connect();

    

    try {

        await client.query("BEGIN");

    const { concertBookingId } = req.params;
     
    console.log("concertBookingId",concertBookingId);
        // 1. Cancel the booking
        const concertBookingResult = await client.query(
            `UPDATE concertbooking
             SET booking_status = 'CANCELLED'
             WHERE id = $1
             RETURNING *`,
            [concertBookingId]
        );

        if (concertBookingResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Booking not found"
            });
        }

        // 2. Get the seat ID
        const getSeat = await client.query(
            `SELECT seat_id
             FROM concertbooking
             WHERE id = $1`,
            [concertBookingId]
        );

        if (getSeat.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Seat not found"
            });
        }

        const seat_id = getSeat.rows[0].seat_id;

        // 3. Make the seat available
        const updateConcertSeats = await client.query(
            `UPDATE concertSeats
             SET status = 'AVAILABLE'
             WHERE id = $1
             RETURNING *`,
            [seat_id]
        );

        if (updateConcertSeats.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                message: "Seat not found"
            });
        }

        // 4. Everything successful
        await client.query("COMMIT");

        return res.status(200).json({
            message: "Cancelled successfully"
        });

    } catch (err) {

        await client.query("ROLLBACK");
        next(err);

    } finally {

        client.release();

    }
};

module.exports = cancelConcert;