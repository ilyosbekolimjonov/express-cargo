// src/validations/validation.js
export const validate = (schema, sorov = 'body') => {
    return async (req, res, next) => {
        try {
            const data = req[sorov];

            if (!data) {
                return res.status(400).json({
                    success: false,
                    message: `So'rovda ${sorov} topilmadi`,
                });
            }

            const { error, value } = schema.validate(data, { abortEarly: false });

            if (error) {
                const messages = error.details.map((d) => d.message);
                return res.status(422).json({
                    success: false,
                    message: "Validatsiya xatosi",
                    errors: messages,
                });
            }

            req[sorov] = value;
            next();
        } catch (err) {
            console.error("Validatsiya xatosi:", err);
            res.status(500).json({
                success: false,
                message: "Validator ishlashida kutilmagan xato",
                error: err.message,
            });
        }
    };
};
