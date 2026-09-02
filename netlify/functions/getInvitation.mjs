import { google } from "googleapis";

export async function handler(event) {
    try {
        const token =
            event.queryStringParameters?.i;

        if (!token) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    error: "Token requerido"
                })
            };
        }

        const auth =
            new google.auth.GoogleAuth({
                credentials: {
                    client_email:
                        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,

                    private_key:
                        process.env.GOOGLE_PRIVATE_KEY
                            ?.replace(/\\n/g, "\n")
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


        const response =
            await sheets.spreadsheets.values.get({
                spreadsheetId:
                    process.env.GOOGLE_SHEET_ID,

                range:
                    "Invitados!A2:D"
            });


        const rows =
            response.data.values || [];


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

        const confirmationsResponse =
            await sheets.spreadsheets.values.get({
                spreadsheetId:
                    process.env.GOOGLE_SHEET_ID,

                range:
                    "Confirmaciones!A2:E"
            });


        const confirmationRows =
            confirmationsResponse.data.values || [];


        const confirmation =
            confirmationRows.find(
                row =>
                    row[0] === token
            );


        const estado =
            confirmation
                ? confirmation[3]
                : null;


        return {
            statusCode: 200,

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                token: sheetToken,
                familia,
                pases:
                    Number(pases),
                estado
            })
        };

    } catch (error) {

        console.error(
            "Error getInvitation:",
            error
        );


        return {
            statusCode: 500,

            body: JSON.stringify({
                error:
                    "Error al consultar la invitación"
            })
        };
    }
}