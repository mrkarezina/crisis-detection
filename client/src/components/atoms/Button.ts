import styled from "styled-components"

interface Variant {
    variant?: "primary" | "secondary"
}

export default styled.button<Variant>`
    font-size: 18px;
    line-height: 1.2;
    font-weight: 400;
    ${props => {
        if (props.variant === "secondary") {
            return `
                color: ${props.theme.colors.dark};
                background-color: ${props.theme.colors.light};
                &:hover {
                    background-color: #F4EBDE;
                }
            `
        }
        return `
            color: ${props.theme.colors.light};
            background-color: ${props.theme.colors.primary};
            &:hover {
                background-color: #e8a131;
            }
        `
    }}
    padding: 10px 38px;
    margin: 0;
    border: none;
    border-radius: 3px;
    box-shadow: 0 2px 18px 0 rgba(0, 0, 0, 0.2);
    cursor: pointer;
    outline: none;

    &:hover {
        transform: scale(1.02);
        box-shadow: 0 3px 24px 0 rgba(0, 0, 0, 0.3);
    }
    &:active {
        transform: scale(1.04);
        box-shadow: 0 3px 24px 0 rgba(0, 0, 0, 0.4);
    }
    transition: all 0.1s ease;
`
