export const formatNumber = (number) => {
    number ??= 0;
    return number.toLocaleString(undefined, { minimumFractionDigits: 2 });
}