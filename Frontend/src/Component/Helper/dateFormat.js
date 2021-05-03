//Time Stamp to Date Convertion
export const DateFormat = (date) => {
    return `${new Date(date).getDate()} - ${
        new Date(date).getMonth() + 1
    } - ${new Date(date).getFullYear()}`;
};

export const DateFormatandMinutes = (date) => {
    return `${new Date(date).getDate()} - ${
        new Date(date).getMonth() + 1
    } - ${new Date(date).getFullYear()}  ${" "} ${new Date(
        date
    ).getHours()}:${new Date(date).getMinutes()}`;
};
