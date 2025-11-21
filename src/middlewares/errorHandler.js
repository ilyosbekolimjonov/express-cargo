import { ApiError } from "./apiError.js"

export const errorHandler = (err, req, res) => {
    console.error("Error:", err.message)

    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message,
        })
    }

    res.status(500).json({
        success: false,
        // message: "Serverda kutilmagan xatolik yuz berdi",
        error: err.message || 'Serverda ichki xatolik yuz berdi',
    })
}