import useWindowDimensions from './useWindowDimensions';

export const useScreen = () => {
    const dimension = useWindowDimensions();

    return {
        isMobile: dimension.width <= 1080,
    };
};
