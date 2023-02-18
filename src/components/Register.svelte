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
	 let isRegisterOpen = false;

	const toggleRegister = () => {
		isRegisterOpen = !isRegisterOpen;
	};

</script>


<div class="d-grid gap-2 d-md-flex">
    <div>
        <Button  class="me-md-2" color="light" outline on:click={toggleRegister}>Register</Button>
        <Modal isOpen={isRegisterOpen} toggle={toggleRegister}>
<Form method="post" action="/register?/register">
            <ModalHeader toggle={toggleRegister}>Register form</ModalHeader>
            <ModalBody>
                
                    <InputGroup>
                        <InputGroupText>📧</InputGroupText>
                        <Input type="email" name="email" id="exampleEmail" placeholder="Email" required />
                    </InputGroup>
                    <br />
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
    <br/>
    <InputGroup>
      
                        <Input style="border-radius: 5px;" type="text" name="firstName" placeholder="First Name" required />
      <div style="width: 5%;"></div>
      <Input style="border-radius: 5px;" type="text" name="lastName" placeholder="Last Name" required />
    </InputGroup>
                
            </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit" >Submit</Button>
                <Button color="secondary" on:click={toggleRegister}>Cancel</Button>
            </ModalFooter>
</Form>
        </Modal>
    </div>
</div>
<slot></slot>