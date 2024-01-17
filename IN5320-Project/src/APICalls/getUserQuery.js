export function  getUserQuery () {
    return {
        me: {
            resource: 'me',
            params: {
                fields: [
                    "id",
                    "name",
                    "organisationUnits"
                ]
            },
        }
    }
}