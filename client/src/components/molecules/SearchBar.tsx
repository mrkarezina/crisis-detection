import React from "react"
import styled from "styled-components"

const SearchBar: React.FC<{
    text: string
    setText(text: string): void
    onSubmit(): void
}> = ({ text, setText, onSubmit }) => {
    return (
        <Container>
            <Input
                placeholder="Search keyword"
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyPress={e => {
                    if (e.key == 'Enter') onSubmit()
                }}
            />
            <SubmitBtn onClick={() => onSubmit()}>Search</SubmitBtn>
        </Container>
    )
}

export default SearchBar

const Container = styled.div`
    display: flex;
    border-radius: 5px;
    overflow: hidden;
    background-color: ${props => props.theme.colors.primaryDark};
    position: absolute;
    left: 30px;
    top: 30px;
    border: 1px solid transparent;
    transition: all 0.2s ease;
    &:hover {
        border: 1px solid ${props => props.theme.colors.primary};
    }
    z-index: 100;
`
const Input = styled.input`
    background-color: #4b6e84;
    border: none;
    font-size: 18px;
    outline: none;
    padding: 12px 15px;
    color: white;
    min-width: 400px;
    ::placeholder {
        color: white;
        opacity: 0.5; /* Firefox */
    }
`
const SubmitBtn = styled.div`
    background-color: ${props => props.theme.colors.primary};
    font-size: 18px;
    color: white;
    padding: 12px 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    &:hover {
        background-color: ${props => props.theme.colors.tint};
    }
`
