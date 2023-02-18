<script lang="ts">
    import {
		Button,
		Modal,
		ModalBody,
		ModalFooter,
		ModalHeader,
		InputGroup,
		InputGroupText,
		Input,
		Form
	} from 'sveltestrap/src';

  let isLoginOpen = false;

	const toggleIsLoged = () => {
		isLoginOpen = !isLoginOpen;
	};

</script>


<div>
    <Button color="light" outline on:click={toggleIsLoged}>Login</Button>
    <Modal isOpen={isLoginOpen} toggle={toggleIsLoged}>
<Form method="post" action="/login?/login">
        <ModalHeader toggle={toggleIsLoged}>Login form</ModalHeader>
        <ModalBody>
                <InputGroup>
                    <InputGroupText>@</InputGroupText>
                    <Input type="text" name="username" placeholder="Username" required />
                </InputGroup>
<br />
                <InputGroup>
                    <InputGroupText>🔒</InputGroupText>
                    <Input
                        type="password"
                        name="password"
                        id="examplePassword"
                        placeholder="Password"
    required
                    />
                </InputGroup>
            
        </ModalBody>
        <ModalFooter>
            <Button color="primary" type="submit" >Submit</Button>
            <Button color="secondary" on:click={toggleIsLoged}>Cancel</Button>
        </ModalFooter>
</Form>
    </Modal>
</div>