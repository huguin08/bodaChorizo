import { google } from "googleapis";

const RSVP_DEADLINE =
    new Date(
        "2026-11-10T23:59:59-06:00"
    );

export async function handler(event) {

    if (event.httpMethod !== "POST") {
        return {
            statusCode: 405,
            body: JSON.stringify({
                error: "Método no permitido"
            })
        };
    }

    if (
        new Date() >
        RSVP_DEADLINE
    ) {

        return {
            statusCode: 403,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                error:
                    "El periodo de confirmación ha finalizado"
            })
        };
    }

    try {

        const {
            token,
            estado
        } = JSON.parse(
            event.body || "{}"
        );


        if (!token || !estado) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Datos incompletos"
                })
            };
        }


        const validStates = [
            "CONFIRMADO",
            "NO_ASISTE"
        ];


        if (
            !validStates.includes(
                estado
            )
        ) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Estado inválido"
                })
            };
        }


        const rawPrivateKey =
            process.env.GOOGLE_PRIVATE_KEY;


        const privateKey =
            rawPrivateKey
                ?.replace(
                    /^["']|["']$/g,
                    ""
                )
                .replace(
                    /\\n/g,
                    "\n"
                )
                .trim();


        const auth =
            new google.auth.GoogleAuth({
                credentials: {
                    client_email:
                        process.env
                            .GOOGLE_SERVICE_ACCOUNT_EMAIL,

                    private_key:
                        privateKey
                },

                scopes: [
                    "https://www.googleapis.com/auth/spreadsheets"
                ]
            });


        const sheets =
            google.sheets({
                version: "v4",
                auth
            });


        /*
         * 1. Consultamos la invitación real.
         * Nunca confiamos en familia/pases enviados
         * desde el navegador.
         */

        const invitationsResponse =
            await sheets.spreadsheets.values.get({
                spreadsheetId:
                    process.env.GOOGLE_SHEET_ID,

                range:
                    "Invitados!A2:D"
            });


        const rows =
            invitationsResponse
                .data
                .values || [];


        const invitation =
            rows.find(
                row =>
                    row[0] === token
            );


        if (!invitation) {
            return {
                statusCode: 404,
                body: JSON.stringify({
                    error:
                        "Invitación no encontrada"
                })
            };
        }


        const [
            sheetToken,
            familia,
            pases,
            activo
        ] = invitation;


        if (activo !== "SI") {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    error:
                        "Invitación inactiva"
                })
            };
        }


        /*
         * 2. Revisamos si ya existe una confirmación
         * para ese token.
         */

        const confirmationsResponse =
            await sheets.spreadsheets.values.get({
                spreadsheetId:
                    process.env.GOOGLE_SHEET_ID,

                range:
                    "Confirmaciones!A2:E"
            });


        const confirmations =
            confirmationsResponse
                .data
                .values || [];


        const existingIndex =
            confirmations.findIndex(
                row =>
                    row[0] === token
            );


        const confirmationDate =
            new Date()
                .toISOString();


        const values = [
            sheetToken,
            familia,
            Number(pases),
            estado,
            confirmationDate
        ];


        /*
         * 3. Si ya existe, actualizamos.
         * Si no, agregamos.
         */

        if (existingIndex >= 0) {

            const sheetRow =
                existingIndex + 2;


            await sheets.spreadsheets.values.update({
                spreadsheetId:
                    process.env.GOOGLE_SHEET_ID,

                range:
                    `Confirmaciones!A${sheetRow}:E${sheetRow}`,

                valueInputOption:
                    "RAW",

                requestBody: {
                    values: [
                        values
                    ]
                }
            });

        } else {

            await sheets.spreadsheets.values.append({
                spreadsheetId:
                    process.env.GOOGLE_SHEET_ID,

                range:
                    "Confirmaciones!A:E",

                valueInputOption:
                    "RAW",

                insertDataOption:
                    "INSERT_ROWS",

                requestBody: {
                    values: [
                        values
                    ]
                }
            });
        }


        return {
            statusCode: 200,
            headers: {
                "Content-Type":
                    "application/json"
            },
            body: JSON.stringify({
                success: true,
                token: sheetToken,
                familia,
                pases:
                    Number(pases),
                estado,
                fecha_confirmacion:
                    confirmationDate
            })
        };


    } catch (error) {

        console.error(
            "Error updateRSVP:",
            error
        );


        return {
            statusCode: 500,
            body: JSON.stringify({
                error:
                    "Error al guardar la confirmación"
            })
        };
    }
}